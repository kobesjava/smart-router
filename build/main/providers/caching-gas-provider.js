"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingGasStationProvider = void 0;
/**
 * Provider for getting gas price, with functionality for caching the results.
 *
 * @export
 * @class CachingV3SubgraphProvider
 */
class CachingGasStationProvider {
    /**
     * Creates an instance of CachingGasStationProvider.
     * @param chainId The chain id to use.
     * @param gasPriceProvider The provider to use to get the gas price when not in the cache.
     * @param cache Cache instance to hold cached pools.
     */
    constructor(chainId, gasPriceProvider, cache) {
        this.chainId = chainId;
        this.gasPriceProvider = gasPriceProvider;
        this.cache = cache;
        this.GAS_KEY = (chainId) => `gasPrice-${chainId}`;
    }
    async getGasPrice() {
        const cachedGasPrice = await this.cache.get(this.GAS_KEY(this.chainId));
        if (cachedGasPrice) {
            // log.info(
            //   { cachedGasPrice },
            //   `Got gas station price from local cache: ${cachedGasPrice.gasPriceWei}.`
            // );
            return cachedGasPrice;
        }
        //log.info('Gas station price local cache miss.');
        const gasPrice = await this.gasPriceProvider.getGasPrice();
        await this.cache.set(this.GAS_KEY(this.chainId), gasPrice);
        return gasPrice;
    }
}
exports.CachingGasStationProvider = CachingGasStationProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy1nYXMtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL2NhY2hpbmctZ2FzLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBOzs7OztHQUtHO0FBQ0gsTUFBYSx5QkFBeUI7SUFHcEM7Ozs7O09BS0c7SUFDSCxZQUNZLE9BQWdCLEVBQ2xCLGdCQUFtQyxFQUNuQyxLQUF1QjtRQUZyQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2xCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUI7UUFDbkMsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFYekIsWUFBTyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFLENBQUMsWUFBWSxPQUFPLEVBQUUsQ0FBQztJQVkzRCxDQUFDO0lBRUcsS0FBSyxDQUFDLFdBQVc7UUFDdEIsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRXhFLElBQUksY0FBYyxFQUFFO1lBQ2xCLFlBQVk7WUFDWix3QkFBd0I7WUFDeEIsNkVBQTZFO1lBQzdFLEtBQUs7WUFDTCxPQUFPLGNBQWMsQ0FBQztTQUN2QjtRQUVELGtEQUFrRDtRQUNsRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQWhDRCw4REFnQ0MifQ==