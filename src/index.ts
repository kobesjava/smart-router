export * from './providers';
export * from './routers';
export * from './util';

import { Protocol } from '@uniswap/router-sdk';
import { Currency, TradeType, Token } from '@uniswap/sdk-core';
import { JsonRpcProvider } from '@ethersproject/providers';
import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list';
import { parseUnits } from '@ethersproject/units';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import NodeCache from 'node-cache';
import { NATIVE_NAMES_BY_ID, TO_PROTOCOL } from './util';
import {
    AlphaRouter,
    CachingGasStationProvider, CachingTokenListProvider, CachingTokenProviderWithFallback, EIP1559GasPriceProvider,
    GasPrice,
    ID_TO_PROVIDER,
    NodeJSCache,
    TokenProvider,
    UniswapMulticallProvider, V3RouteWithValidQuote,
    ID_TO_CHAIN_ID, nativeOnChain, parseAmountWithDecimal, SwapRoute, routeAmountsToString, V3Route
} from './';
import { OnChainGasPriceProvider } from './providers/on-chain-gas-price-provider';
import { LegacyGasPriceProvider } from './providers/legacy-gas-price-provider';


const dotenv = require("dotenv")
dotenv.config()
const express = require('express')
const app = express()
const port = 9101

app.get('/router', async (req: any, res: any) => {
    console.log("request start: " + Date.now())
    try {
        const chainId: number = Number(req.query.chainId)
        const tokenIn: string = req.query.tokenIn
        const tokenOut: string = req.query.tokenOut
        const amount: number = Number(req.query.amount)
        const route = await getRoute(chainId, tokenIn, tokenOut, amount.toString())
        res.send(route)
    } catch (e) {
        console.log("Exception: " + e)
        res.send("{}")
    }
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

async function getRoute(chainIdNumb: number, tokenInStr: string, tokenOutStr: string, amountStr: string) {
    const chainId = ID_TO_CHAIN_ID(chainIdNumb);
    const chainProvider = ID_TO_PROVIDER(chainId);
    const provider = new JsonRpcProvider(chainProvider, chainId);
    const blockNumber = await provider.getBlockNumber();
    //const recipient = "0x81941c0E31e32FFB8D61D8972a20DAe48bC62d81"

    const tokenCache = new NodeJSCache<Token>(
        new NodeCache({ stdTTL: 3600, useClones: false })
    );

    let tokenListProvider: CachingTokenListProvider;
    // if (tokenListURI) {
    //     tokenListProvider = await CachingTokenListProvider.fromTokenListURI(
    //         chainId,
    //         tokenListURI,
    //         tokenCache
    //     );
    // } else {
    tokenListProvider = await CachingTokenListProvider.fromTokenList(
        chainId,
        DEFAULT_TOKEN_LIST,
        tokenCache
    );
    // }

    let multicall2Provider = new UniswapMulticallProvider(chainId, provider, 1_000_000);
    // switch (chainId) {
    //     case ChainId.Linea_GOERLI:
    //         multicall2Provider = new UniswapMulticall3Provider(chainId, provider, 375_000);
    //         break;
    //     default:
    //         multicall2Provider = new UniswapMulticallProvider(chainId, provider, 375_000);
    //         break;
    // }
    //const poolProvider = new V3PoolProvider(chainId, multicall2Provider);

    // initialize tokenProvider
    const tokenProviderOnChain = new TokenProvider(chainId, multicall2Provider);
    const tokenProvider = new CachingTokenProviderWithFallback(
        chainId,
        tokenCache,
        tokenListProvider,
        tokenProviderOnChain
    );


    const gasPriceCache = new NodeJSCache<GasPrice>(
        new NodeCache({ stdTTL: 15, useClones: true })
    );

    const router = new AlphaRouter({
        provider,
        chainId,
        multicall2Provider: multicall2Provider,
        gasPriceProvider: new CachingGasStationProvider(
            chainId,
            new OnChainGasPriceProvider(
                chainId,
                new EIP1559GasPriceProvider(provider),
                new LegacyGasPriceProvider(provider)
            ),
            gasPriceCache
        ),
    });

    //const topNSecondHopForTokenAddress = new MapWithLowerCaseKey();
    // topNSecondHopForTokenAddressRaw.split(',').forEach((entry) => {
    //     if (entry != '') {
    //         const entryParts = entry.split('|');
    //         if (entryParts.length != 2) {
    //             throw new Error(
    //                 'flag --topNSecondHopForTokenAddressRaw must be in format tokenAddress|topN,...');
    //         }
    //         const topNForTokenAddress: number = Number(entryParts[1]!);
    //         topNSecondHopForTokenAddress.set(entryParts[0]!, topNForTokenAddress);
    //     }
    // });

    // if ((exactIn && exactOut) || (!exactIn && !exactOut)) {
    //     throw new Error('Must set either --exactIn or --exactOut.');
    // }

    let protocols: Protocol[] = [TO_PROTOCOL("v3")]//[TO_PROTOCOL("v2"), TO_PROTOCOL("v3"), TO_PROTOCOL("mixed")];
    // if (protocolsStr) {
    //     try {
    //         protocols = _.map(protocolsStr.split(','), (protocolStr) =>
    //             TO_PROTOCOL(protocolStr)
    //         );
    //     } catch (err) {
    //         throw new Error(
    //             `Protocols invalid. Valid options: ${Object.values(Protocol)}`
    //         );
    //     }
    // }

    // if the tokenIn str is 'ETH' or 'MATIC' or in NATIVE_NAMES_BY_ID
    const tokenIn: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(tokenInStr)
        ? nativeOnChain(chainId)
        : (await tokenProvider.getTokens([tokenInStr])).getTokenByAddress(
            tokenInStr
        )!;

    const tokenOut: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(tokenOutStr)
        ? nativeOnChain(chainId)
        : (await tokenProvider.getTokens([tokenOutStr])).getTokenByAddress(
            tokenOutStr
        )!;


    const start = Date.now()
    let swapRoutes: SwapRoute | null;
    //if (exactIn) {
    const amountIn = parseAmountWithDecimal(amountStr, tokenIn);
    swapRoutes = await router.route(
        amountIn,
        tokenOut,
        TradeType.EXACT_INPUT,
        undefined,
        {
            blockNumber: blockNumber,
            v3PoolSelection: {
                topN: 3,
                topNTokenInOut: 2,
                topNSecondHop: 2,
                topNWithEachBaseToken: 2,
                topNWithBaseToken: 6,
                topNDirectSwaps: 2,
            },
            maxSwapsPerPath: 3,
            minSplits: 1,
            maxSplits: 3,
            distributionPercent: 5,
            protocols,
            forceCrossProtocol: false,
            forceMixedRoutes: false,
            debugRouting: false,
            enableFeeOnTransferFeeFetching: false
        }
    );
    const end = Date.now()
    console.log("route end: " + (end - start))

    if (!swapRoutes) {
        return null;
    }

    //console.log(JSON.stringify(swapRoutes))

    let result = {
        "quote": {
            "blockNumber": blockNumber.toString(),
            "amount": amountStr,
            "amountDecimals": amountIn.toExact(),
            "quote": parseUnits(swapRoutes.quote.toExact(), swapRoutes.quote.currency.decimals).toString(),
            "quoteDecimals": swapRoutes.quote.toExact(),
            "quoteGasAdjusted": parseUnits(swapRoutes.quoteGasAdjusted.toExact(), swapRoutes.quoteGasAdjusted.currency.decimals).toString(),
            "quoteGasAdjustedDecimals": swapRoutes.quoteGasAdjusted.toExact(),
            "gasUseEstimate": swapRoutes.estimatedGasUsed.toString(),
            "gasUseEstimateQuote": parseUnits(swapRoutes.estimatedGasUsedQuoteToken.toExact(), swapRoutes.estimatedGasUsedQuoteToken.currency.decimals).toString(),
            "gasUseEstimateQuoteDecimals": swapRoutes.estimatedGasUsedQuoteToken.toExact(),
            "gasUseEstimateUSD": swapRoutes.estimatedGasUsedUSD.toExact(),
            "gasPriceWei": swapRoutes.gasPriceWei.toString(),
            "routeString": routeAmountsToString(swapRoutes.route),
            "tradeType": "EXACT_INPUT",
            "priceImpact": "",
            "tokenPath": [] as any[],
            "route": [] as any[]
        },
    }
    const route = swapRoutes.route[0]
    if (route) {
        for (let index in route.tokenPath) {
            result.quote.tokenPath.push({
                "chainId": route.tokenPath[index]!.chainId,
                "decimals": route.tokenPath[index]!.decimals,
                "address": route.tokenPath[index]!.address,
                "symbol": route.tokenPath[index]!.symbol,
            })
        }
        if (route.route instanceof V3Route) {
            for (let index = 0; index < route.route.pools.length; index++) {
                const routePool = route.route.pools[index]
                let routePoolObj = {
                    "type": route.protocol,
                    "address": route.poolAddresses[index],
                    "fee": routePool?.fee,
                    "liquidity": routePool?.liquidity.toString(),
                    "sqrtRatioX96": routePool?.sqrtRatioX96.toString(),
                    "token0": {
                        "chainId": routePool?.token0.chainId,
                        "decimals": routePool?.token0.decimals,
                        "address": routePool?.token0.address,
                        "symbol": routePool?.token0.symbol,
                    },
                    "token1": {
                        "chainId": routePool?.token1.chainId,
                        "decimals": routePool?.token1.decimals,
                        "address": routePool?.token1.address,
                        "symbol": routePool?.token1.symbol,
                    }
                }
                result.quote.route.push(routePoolObj)

                console.log("sqrtRatioX96: " + routePool?.sqrtRatioX96.toString())

                if (index == route.route.pools.length - 1) {
                    //price impact
                    const isToken0Input = routePool?.token0.address.toLowerCase() != tokenOutStr.toLowerCase()
                    if (route instanceof V3RouteWithValidQuote) {
                        console.log("sqrtPriceX96AfterList: " + route.sqrtPriceX96AfterList[index]?.toString() + " isToken0Input: " + isToken0Input)
                        try {
                            const price = sqrtToPrice(new BigNumber(routePool!.sqrtRatioX96.toString()), new BigNumber(routePool!.token0.decimals), new BigNumber(routePool!.token1.decimals), isToken0Input)
                            //console.log('price', price.toString())
                            const priceAfter = sqrtToPrice(new BigNumber(route.sqrtPriceX96AfterList[index]!.toString()), new BigNumber(routePool!.token0.decimals), new BigNumber(routePool!.token1.decimals), isToken0Input)
                            //console.log('priceAfter', priceAfter.toString())
                            const absoluteChange = price.minus(priceAfter)
                            //console.log('absoluteChange', absoluteChange.toString())
                            const percentChange = absoluteChange.div(price)//absoluteChange / price
                            //console.log('percentChange', percentChange.toString())
                            //console.log('percent change', (percentChange.multipliedBy(100)).toNumber().toFixed(3), '%')
                            result.quote.priceImpact = (percentChange.multipliedBy(100)).toNumber().toFixed(3)
                        } catch (e) {
                            console.log("Exception priceImpact: " + e)
                        }
                    }
                }

            }
        }
    }
    return result
}

function sqrtToPrice(sqrt: BigNumber, decimals0: BigNumber, decimals1: BigNumber, token0IsInput = true) {
    const numerator = sqrt.multipliedBy(sqrt)
    let ratio = numerator.dividedBy(2 ** 50).dividedBy(2 ** 50).dividedBy(2 ** 50).dividedBy(2 ** 42) //numerator / denominator
    const shiftDecimals = new BigNumber(10).pow(decimals0.minus(decimals1).toNumber())   //Math.pow(10, decimals0 - decimals1)
    ratio = ratio.multipliedBy(shiftDecimals)//ratio * shiftDecimals
    if (!token0IsInput) {
        ratio = new BigNumber(1).div(ratio) // 1 / ratio
    }
    return ratio
}

