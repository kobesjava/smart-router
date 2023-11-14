"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingTokenProviderWithFallback = exports.CACHE_SEED_TOKENS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../util");
const token_provider_1 = require("./token-provider");
// These tokens will added to the Token cache on initialization.
exports.CACHE_SEED_TOKENS = {
    [sdk_core_1.ChainId.Linea_GOERLI]: {
        USDT: token_provider_1.USDT_LINEA_GOERLI,
        USDC: token_provider_1.USDC_LINEA_GOERLI,
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.Linea_GOERLI],
    },
    [sdk_core_1.ChainId.LINEA]: {
        USDT: token_provider_1.USDT_LINEA,
        USDC: token_provider_1.USDC_LINEA,
        DAI: token_provider_1.DAI_LINEA,
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.LINEA],
    }
    // Currently we do not have providers for Moonbeam mainnet or Gnosis testnet
};
/**
 * Provider for getting token metadata that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class CachingTokenProviderWithFallback
 */
class CachingTokenProviderWithFallback {
    constructor(chainId, 
    // Token metadata (e.g. symbol and decimals) don't change so can be cached indefinitely.
    // Constructing a new token object is slow as sdk-core does checksumming.
    tokenCache, primaryTokenProvider, fallbackTokenProvider) {
        this.chainId = chainId;
        this.tokenCache = tokenCache;
        this.primaryTokenProvider = primaryTokenProvider;
        this.fallbackTokenProvider = fallbackTokenProvider;
        this.CACHE_KEY = (chainId, address) => `token-${chainId}-${address}`;
    }
    async getTokens(_addresses) {
        const seedTokens = exports.CACHE_SEED_TOKENS[this.chainId];
        if (seedTokens) {
            for (const token of Object.values(seedTokens)) {
                await this.tokenCache.set(this.CACHE_KEY(this.chainId, token.address.toLowerCase()), token);
            }
        }
        const addressToToken = {};
        const symbolToToken = {};
        const addresses = (0, lodash_1.default)(_addresses)
            .map((address) => address.toLowerCase())
            .uniq()
            .value();
        const addressesToFindInPrimary = [];
        const addressesToFindInSecondary = [];
        for (const address of addresses) {
            if (await this.tokenCache.has(this.CACHE_KEY(this.chainId, address))) {
                addressToToken[address.toLowerCase()] = (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)));
                symbolToToken[addressToToken[address].symbol] =
                    (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)));
            }
            else {
                addressesToFindInPrimary.push(address);
            }
        }
        if (addressesToFindInPrimary.length > 0) {
            const primaryTokenAccessor = await this.primaryTokenProvider.getTokens(addressesToFindInPrimary);
            for (const address of addressesToFindInPrimary) {
                const token = primaryTokenAccessor.getTokenByAddress(address);
                if (token) {
                    addressToToken[address.toLowerCase()] = token;
                    symbolToToken[addressToToken[address].symbol] = token;
                    await this.tokenCache.set(this.CACHE_KEY(this.chainId, address.toLowerCase()), addressToToken[address]);
                }
                else {
                    addressesToFindInSecondary.push(address);
                }
            }
        }
        if (this.fallbackTokenProvider && addressesToFindInSecondary.length > 0) {
            const secondaryTokenAccessor = await this.fallbackTokenProvider.getTokens(addressesToFindInSecondary);
            for (const address of addressesToFindInSecondary) {
                const token = secondaryTokenAccessor.getTokenByAddress(address);
                if (token) {
                    addressToToken[address.toLowerCase()] = token;
                    symbolToToken[addressToToken[address].symbol] = token;
                    await this.tokenCache.set(this.CACHE_KEY(this.chainId, address.toLowerCase()), addressToToken[address]);
                }
            }
        }
        return {
            getTokenByAddress: (address) => {
                return addressToToken[address.toLowerCase()];
            },
            getTokenBySymbol: (symbol) => {
                return symbolToToken[symbol.toLowerCase()];
            },
            getAllTokens: () => {
                return Object.values(addressToToken);
            },
        };
    }
}
exports.CachingTokenProviderWithFallback = CachingTokenProviderWithFallback;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy10b2tlbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvY2FjaGluZy10b2tlbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBbUQ7QUFDbkQsb0RBQXVCO0FBRXZCLGtDQUFrRDtBQUdsRCxxREFRMEI7QUFFMUIsZ0VBQWdFO0FBQ25ELFFBQUEsaUJBQWlCLEdBRTFCO0lBQ0YsQ0FBQyxrQkFBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ3RCLElBQUksRUFBRSxrQ0FBaUI7UUFDdkIsSUFBSSxFQUFFLGtDQUFpQjtRQUN2QixJQUFJLEVBQUUsOEJBQXVCLENBQUMsa0JBQU8sQ0FBQyxZQUFZLENBQUM7S0FDcEQ7SUFDRCxDQUFDLGtCQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsMkJBQVU7UUFDaEIsSUFBSSxFQUFFLDJCQUFVO1FBQ2hCLEdBQUcsRUFBRSwwQkFBUztRQUNkLElBQUksRUFBRSw4QkFBdUIsQ0FBQyxrQkFBTyxDQUFDLEtBQUssQ0FBQztLQUM3QztJQUNELDRFQUE0RTtDQUM3RSxDQUFDO0FBRUY7Ozs7OztHQU1HO0FBQ0gsTUFBYSxnQ0FBZ0M7SUFJM0MsWUFDWSxPQUFnQjtJQUMxQix3RkFBd0Y7SUFDeEYseUVBQXlFO0lBQ2pFLFVBQXlCLEVBQ3ZCLG9CQUFvQyxFQUNwQyxxQkFBc0M7UUFMdEMsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUdsQixlQUFVLEdBQVYsVUFBVSxDQUFlO1FBQ3ZCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBZ0I7UUFDcEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFpQjtRQVQxQyxjQUFTLEdBQUcsQ0FBQyxPQUFnQixFQUFFLE9BQWUsRUFBRSxFQUFFLENBQ3hELFNBQVMsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBUzVCLENBQUM7SUFFRSxLQUFLLENBQUMsU0FB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