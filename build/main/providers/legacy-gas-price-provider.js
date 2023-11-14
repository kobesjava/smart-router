"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyGasPriceProvider = void 0;
const gas_price_provider_1 = require("./gas-price-provider");
class LegacyGasPriceProvider extends gas_price_provider_1.IGasPriceProvider {
    constructor(provider) {
        super();
        this.provider = provider;
    }
    async getGasPrice() {
        const gasPriceWei = await this.provider.getGasPrice();
        // log.info(
        //   { gasPriceWei },
        //   `Got gas price ${gasPriceWei} using eth_gasPrice RPC`
        // );
        return {
            gasPriceWei,
        };
    }
}
exports.LegacyGasPriceProvider = LegacyGasPriceProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LWdhcy1wcmljZS1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvbGVnYWN5LWdhcy1wcmljZS1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw2REFBbUU7QUFFbkUsTUFBYSxzQkFBdUIsU0FBUSxzQ0FBaUI7SUFDM0QsWUFBc0IsUUFBeUI7UUFDN0MsS0FBSyxFQUFFLENBQUM7UUFEWSxhQUFRLEdBQVIsUUFBUSxDQUFpQjtJQUUvQyxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVc7UUFDdEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RELFlBQVk7UUFDWixxQkFBcUI7UUFDckIsMERBQTBEO1FBQzFELEtBQUs7UUFDTCxPQUFPO1lBQ0wsV0FBVztTQUNaLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFmRCx3REFlQyJ9