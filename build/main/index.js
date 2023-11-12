"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./providers"), exports);
__exportStar(require("./routers"), exports);
__exportStar(require("./util"), exports);
const sdk_core_1 = require("@uniswap/sdk-core");
const providers_1 = require("@ethersproject/providers");
const default_token_list_1 = __importDefault(require("@uniswap/default-token-list"));
const units_1 = require("@ethersproject/units");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const node_cache_1 = __importDefault(require("node-cache"));
const util_1 = require("./util");
const _1 = require("./");
const on_chain_gas_price_provider_1 = require("./providers/on-chain-gas-price-provider");
const legacy_gas_price_provider_1 = require("./providers/legacy-gas-price-provider");
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const port = 9101;
app.get('/router', async (req, res) => {
    try {
        const start = Date.now();
        console.log("request start: " + start);
        const chainId = Number(req.query.chainId);
        const tokenIn = req.query.tokenIn;
        const tokenOut = req.query.tokenOut;
        const amount = Number(req.query.amount);
        const route = await getRoute(chainId, tokenIn, tokenOut, amount.toString());
        console.log("request end: " + (Date.now() - start));
        res.send(route);
    }
    catch (e) {
        console.log("Exception: " + e);
        res.send({ code: 0, message: "" });
    }
});
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
async function getRoute(chainIdNumb, tokenInStr, tokenOutStr, amountStr) {
    var _a;
    const start = Date.now();
    const chainId = (0, _1.ID_TO_CHAIN_ID)(chainIdNumb);
    const chainProvider = (0, _1.ID_TO_PROVIDER)(chainId);
    const provider = new providers_1.JsonRpcProvider(chainProvider, chainId);
    const blockNumber = await provider.getBlockNumber();
    //const recipient = "0x81941c0E31e32FFB8D61D8972a20DAe48bC62d81"
    const tokenCache = new _1.NodeJSCache(new node_cache_1.default({ stdTTL: 3600, useClones: false }));
    let tokenListProvider;
    // if (tokenListURI) {
    //     tokenListProvider = await CachingTokenListProvider.fromTokenListURI(
    //         chainId,
    //         tokenListURI,
    //         tokenCache
    //     );
    // } else {
    tokenListProvider = await _1.CachingTokenListProvider.fromTokenList(chainId, default_token_list_1.default, tokenCache);
    // }
    let multicall2Provider = new _1.UniswapMulticallProvider(chainId, provider, 1000000);
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
    const tokenProviderOnChain = new _1.TokenProvider(chainId, multicall2Provider);
    const tokenProvider = new _1.CachingTokenProviderWithFallback(chainId, tokenCache, tokenListProvider, tokenProviderOnChain);
    const gasPriceCache = new _1.NodeJSCache(new node_cache_1.default({ stdTTL: 15, useClones: true }));
    const router = new _1.AlphaRouter({
        provider,
        chainId,
        multicall2Provider: multicall2Provider,
        gasPriceProvider: new _1.CachingGasStationProvider(chainId, new on_chain_gas_price_provider_1.OnChainGasPriceProvider(chainId, new _1.EIP1559GasPriceProvider(provider), new legacy_gas_price_provider_1.LegacyGasPriceProvider(provider)), gasPriceCache),
    });
    let protocols = [(0, util_1.TO_PROTOCOL)("v3")]; //[TO_PROTOCOL("v2"), TO_PROTOCOL("v3"), TO_PROTOCOL("mixed")];
    // if the tokenIn str is 'ETH' or 'MATIC' or in NATIVE_NAMES_BY_ID
    const tokenIn = util_1.NATIVE_NAMES_BY_ID[chainId].includes(tokenInStr)
        ? (0, _1.nativeOnChain)(chainId)
        : (await tokenProvider.getTokens([tokenInStr])).getTokenByAddress(tokenInStr);
    const tokenOut = util_1.NATIVE_NAMES_BY_ID[chainId].includes(tokenOutStr)
        ? (0, _1.nativeOnChain)(chainId)
        : (await tokenProvider.getTokens([tokenOutStr])).getTokenByAddress(tokenOutStr);
    console.log("init end: " + (Date.now() - start));
    let swapRoutes;
    //if (exactIn) {
    const amountIn = (0, _1.parseAmountWithDecimal)(amountStr, tokenIn);
    try {
        swapRoutes = await router.route(amountIn, tokenOut, sdk_core_1.TradeType.EXACT_INPUT, undefined, {
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
        });
    }
    catch (error) {
        return { code: 0, message: error.message };
    }
    //console.log(swapRoutes)
    if (!swapRoutes) {
        return { code: 0, message: "not find route" };
    }
    //console.log(JSON.stringify(swapRoutes))
    let result = {
        "quote": {
            "blockNumber": blockNumber.toString(),
            "amount": amountStr,
            "amountDecimals": amountIn.toExact(),
            "quote": (0, units_1.parseUnits)(swapRoutes.quote.toExact(), swapRoutes.quote.currency.decimals).toString(),
            "quoteDecimals": swapRoutes.quote.toExact(),
            "quoteGasAdjusted": (0, units_1.parseUnits)(swapRoutes.quoteGasAdjusted.toExact(), swapRoutes.quoteGasAdjusted.currency.decimals).toString(),
            "quoteGasAdjustedDecimals": swapRoutes.quoteGasAdjusted.toExact(),
            "gasUseEstimate": swapRoutes.estimatedGasUsed.toString(),
            "gasUseEstimateQuote": (0, units_1.parseUnits)(swapRoutes.estimatedGasUsedQuoteToken.toExact(), swapRoutes.estimatedGasUsedQuoteToken.currency.decimals).toString(),
            "gasUseEstimateQuoteDecimals": swapRoutes.estimatedGasUsedQuoteToken.toExact(),
            "gasUseEstimateUSD": swapRoutes.estimatedGasUsedUSD.toExact(),
            "gasPriceWei": swapRoutes.gasPriceWei.toString(),
            "routeString": (0, _1.routeAmountsToString)(swapRoutes.route),
            "tradeType": "EXACT_INPUT",
            "priceImpact": "",
            "tokenPath": [],
            "route": []
        },
    };
    const route = swapRoutes.route[0];
    if (route) {
        for (let index in route.tokenPath) {
            result.quote.tokenPath.push({
                "chainId": route.tokenPath[index].chainId,
                "decimals": route.tokenPath[index].decimals,
                "address": route.tokenPath[index].address,
                "symbol": route.tokenPath[index].symbol,
            });
        }
        if (route.route instanceof _1.V3Route) {
            for (let index = 0; index < route.route.pools.length; index++) {
                const routePool = route.route.pools[index];
                let routePoolObj = {
                    "type": route.protocol,
                    "address": route.poolAddresses[index],
                    "fee": routePool === null || routePool === void 0 ? void 0 : routePool.fee,
                    "liquidity": routePool === null || routePool === void 0 ? void 0 : routePool.liquidity.toString(),
                    "sqrtRatioX96": routePool === null || routePool === void 0 ? void 0 : routePool.sqrtRatioX96.toString(),
                    "token0": {
                        "chainId": routePool === null || routePool === void 0 ? void 0 : routePool.token0.chainId,
                        "decimals": routePool === null || routePool === void 0 ? void 0 : routePool.token0.decimals,
                        "address": routePool === null || routePool === void 0 ? void 0 : routePool.token0.address,
                        "symbol": routePool === null || routePool === void 0 ? void 0 : routePool.token0.symbol,
                    },
                    "token1": {
                        "chainId": routePool === null || routePool === void 0 ? void 0 : routePool.token1.chainId,
                        "decimals": routePool === null || routePool === void 0 ? void 0 : routePool.token1.decimals,
                        "address": routePool === null || routePool === void 0 ? void 0 : routePool.token1.address,
                        "symbol": routePool === null || routePool === void 0 ? void 0 : routePool.token1.symbol,
                    }
                };
                result.quote.route.push(routePoolObj);
                console.log("sqrtRatioX96: " + (routePool === null || routePool === void 0 ? void 0 : routePool.sqrtRatioX96.toString()));
                if (index == route.route.pools.length - 1) {
                    //price impact
                    const isToken0Input = (routePool === null || routePool === void 0 ? void 0 : routePool.token0.address.toLowerCase()) != tokenOutStr.toLowerCase();
                    if (route instanceof _1.V3RouteWithValidQuote) {
                        console.log("sqrtPriceX96AfterList: " + ((_a = route.sqrtPriceX96AfterList[index]) === null || _a === void 0 ? void 0 : _a.toString()) + " isToken0Input: " + isToken0Input);
                        try {
                            const price = sqrtToPrice(new bignumber_js_1.default(routePool.sqrtRatioX96.toString()), new bignumber_js_1.default(routePool.token0.decimals), new bignumber_js_1.default(routePool.token1.decimals), isToken0Input);
                            //console.log('price', price.toString())
                            const priceAfter = sqrtToPrice(new bignumber_js_1.default(route.sqrtPriceX96AfterList[index].toString()), new bignumber_js_1.default(routePool.token0.decimals), new bignumber_js_1.default(routePool.token1.decimals), isToken0Input);
                            //console.log('priceAfter', priceAfter.toString())
                            const absoluteChange = price.minus(priceAfter);
                            //console.log('absoluteChange', absoluteChange.toString())
                            const percentChange = absoluteChange.div(price); //absoluteChange / price
                            //console.log('percentChange', percentChange.toString())
                            //console.log('percent change', (percentChange.multipliedBy(100)).toNumber().toFixed(3), '%')
                            result.quote.priceImpact = (percentChange.multipliedBy(100)).toNumber().toFixed(3);
                        }
                        catch (e) {
                            console.log("Exception priceImpact: " + e);
                        }
                    }
                }
            }
        }
    }
    return { code: 1, data: result };
}
function sqrtToPrice(sqrt, decimals0, decimals1, token0IsInput = true) {
    const numerator = sqrt.multipliedBy(sqrt);
    let ratio = numerator.dividedBy(2 ** 50).dividedBy(2 ** 50).dividedBy(2 ** 50).dividedBy(2 ** 42); //numerator / denominator
    const shiftDecimals = new bignumber_js_1.default(10).pow(decimals0.minus(decimals1).toNumber()); //Math.pow(10, decimals0 - decimals1)
    ratio = ratio.multipliedBy(shiftDecimals); //ratio * shiftDecimals
    if (!token0IsInput) {
        ratio = new bignumber_js_1.default(1).div(ratio); // 1 / ratio
    }
    return ratio;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE0QjtBQUM1Qiw0Q0FBMEI7QUFDMUIseUNBQXVCO0FBR3ZCLGdEQUErRDtBQUMvRCx3REFBMkQ7QUFDM0QscUZBQTZEO0FBQzdELGdEQUFrRDtBQUNsRCxnRUFBcUM7QUFFckMsNERBQW1DO0FBQ25DLGlDQUF5RDtBQUN6RCx5QkFTWTtBQUNaLHlGQUFrRjtBQUNsRixxRkFBK0U7QUFHL0UsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUNmLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQTtBQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUE7QUFFakIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQVEsRUFBRSxHQUFRLEVBQUUsRUFBRTtJQUM1QyxJQUFJO1FBQ0EsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLENBQUE7UUFDdEMsTUFBTSxPQUFPLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDakQsTUFBTSxPQUFPLEdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7UUFDekMsTUFBTSxRQUFRLEdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUE7UUFDM0MsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDL0MsTUFB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