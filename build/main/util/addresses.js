"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETH9 = exports.constructSameAddressMap = exports.MULTICALL2_ADDRESS = exports.V3_MIGRATOR_ADDRESS = exports.NONFUNGIBLE_POSITION_MANAGER_ADDRESS = exports.TICK_LENS_ADDRESS = exports.ARB_GASINFO_ADDRESS = exports.OVM_GASPRICE_ADDRESS = exports.SWAP_ROUTER_02_ADDRESSES = exports.UNISWAP_MULTICALL_ADDRESSES = exports.MIXED_ROUTE_QUOTER_V1_ADDRESSES = exports.QUOTER_V2_ADDRESSES = exports.V3_CORE_FACTORY_ADDRESSES = exports.BNB_V3_MIGRATOR_ADDRESS = exports.BNB_SWAP_ROUTER_02_ADDRESS = exports.BNB_NONFUNGIBLE_POSITION_MANAGER_ADDRESS = exports.BNB_TICK_LENS_ADDRESS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const chains_1 = require("./chains");
exports.BNB_TICK_LENS_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].tickLensAddress;
exports.BNB_NONFUNGIBLE_POSITION_MANAGER_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].nonfungiblePositionManagerAddress;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
exports.BNB_SWAP_ROUTER_02_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].swapRouter02Address;
exports.BNB_V3_MIGRATOR_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].v3MigratorAddress;
exports.V3_CORE_FACTORY_ADDRESSES = Object.assign(Object.assign({}, constructSameAddressMap(v3_sdk_1.FACTORY_ADDRESS)), { [sdk_core_1.ChainId.CELO]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.CELO].v3CoreFactoryAddress, [sdk_core_1.ChainId.CELO_ALFAJORES]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.CELO_ALFAJORES].v3CoreFactoryAddress, [sdk_core_1.ChainId.OPTIMISM_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.OPTIMISM_GOERLI].v3CoreFactoryAddress, [sdk_core_1.ChainId.SEPOLIA]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.SEPOLIA].v3CoreFactoryAddress, [sdk_core_1.ChainId.ARBITRUM_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.ARBITRUM_GOERLI].v3CoreFactoryAddress, [sdk_core_1.ChainId.BNB]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].v3CoreFactoryAddress, [sdk_core_1.ChainId.AVALANCHE]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.AVALANCHE].v3CoreFactoryAddress, [sdk_core_1.ChainId.BASE_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BASE_GOERLI].v3CoreFactoryAddress, [sdk_core_1.ChainId.BASE]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BASE].v3CoreFactoryAddress, [sdk_core_1.ChainId.Linea_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.Linea_GOERLI].v3CoreFactoryAddress, [sdk_core_1.ChainId.LINEA]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.LINEA].v3CoreFactoryAddress });
exports.QUOTER_V2_ADDRESSES = Object.assign(Object.assign({}, constructSameAddressMap('0x61fFE014bA17989E743c5F6cB21bF9697530B21e')), { [sdk_core_1.ChainId.CELO]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.CELO].quoterAddress, [sdk_core_1.ChainId.CELO_ALFAJORES]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.CELO_ALFAJORES].quoterAddress, [sdk_core_1.ChainId.OPTIMISM_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.OPTIMISM_GOERLI].quoterAddress, [sdk_core_1.ChainId.SEPOLIA]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.SEPOLIA].quoterAddress, [sdk_core_1.ChainId.ARBITRUM_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.ARBITRUM_GOERLI].quoterAddress, [sdk_core_1.ChainId.BNB]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].quoterAddress, [sdk_core_1.ChainId.AVALANCHE]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.AVALANCHE].quoterAddress, [sdk_core_1.ChainId.BASE_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BASE_GOERLI].quoterAddress, [sdk_core_1.ChainId.BASE]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BASE].quoterAddress, [sdk_core_1.ChainId.Linea_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.Linea_GOERLI].quoterAddress, [sdk_core_1.ChainId.LINEA]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.LINEA].quoterAddress });
exports.MIXED_ROUTE_QUOTER_V1_ADDRESSES = {
    [sdk_core_1.ChainId.MAINNET]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.MAINNET].v1MixedRouteQuoterAddress,
    [sdk_core_1.ChainId.GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.GOERLI].v1MixedRouteQuoterAddress,
};
exports.UNISWAP_MULTICALL_ADDRESSES = Object.assign(Object.assign({}, constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984')), { [sdk_core_1.ChainId.CELO]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.CELO].multicallAddress, [sdk_core_1.ChainId.CELO_ALFAJORES]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.CELO_ALFAJORES].multicallAddress, [sdk_core_1.ChainId.OPTIMISM_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.OPTIMISM_GOERLI].multicallAddress, [sdk_core_1.ChainId.SEPOLIA]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.SEPOLIA].multicallAddress, [sdk_core_1.ChainId.ARBITRUM_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.ARBITRUM_GOERLI].multicallAddress, [sdk_core_1.ChainId.BNB]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BNB].multicallAddress, [sdk_core_1.ChainId.AVALANCHE]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.AVALANCHE].multicallAddress, [sdk_core_1.ChainId.BASE_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BASE_GOERLI].multicallAddress, [sdk_core_1.ChainId.BASE]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.BASE].multicallAddress, [sdk_core_1.ChainId.Linea_GOERLI]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.Linea_GOERLI].multicallAddress, [sdk_core_1.ChainId.LINEA]: sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.LINEA].multicallAddress });
const SWAP_ROUTER_02_ADDRESSES = (chainId) => {
    if (chainId == sdk_core_1.ChainId.BNB) {
        return exports.BNB_SWAP_ROUTER_02_ADDRESS;
    }
    return '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
};
exports.SWAP_ROUTER_02_ADDRESSES = SWAP_ROUTER_02_ADDRESSES;
exports.OVM_GASPRICE_ADDRESS = '0x420000000000000000000000000000000000000F';
exports.ARB_GASINFO_ADDRESS = '0x000000000000000000000000000000000000006C';
exports.TICK_LENS_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.ARBITRUM_ONE].tickLensAddress;
exports.NONFUNGIBLE_POSITION_MANAGER_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.MAINNET].nonfungiblePositionManagerAddress;
exports.V3_MIGRATOR_ADDRESS = sdk_core_1.CHAIN_TO_ADDRESSES_MAP[sdk_core_1.ChainId.MAINNET].v3MigratorAddress;
exports.MULTICALL2_ADDRESS = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696';
function constructSameAddressMap(address, additionalNetworks = []) {
    return chains_1.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES.concat(additionalNetworks).reduce((memo, chainId) => {
        memo[chainId] = address;
        return memo;
    }, {});
}
exports.constructSameAddressMap = constructSameAddressMap;
exports.WETH9 = {
    [sdk_core_1.ChainId.MAINNET]: new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.SEPOLIA, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_ONE]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_GOERLI, '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BASE_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BASE]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.Linea_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.Linea_GOERLI, '0x2C1b868d6596a18e32E61B901E4060C872647b6C', 18, 'WETH', 'Wrapped Ether'),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvYWRkcmVzc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUEyRTtBQUMzRSw0Q0FBa0Q7QUFFbEQscUNBQWdFO0FBRW5ELFFBQUEscUJBQXFCLEdBQUcsaUNBQXNCLENBQUMsa0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUM7QUFDNUUsUUFBQSx3Q0FBd0MsR0FBRyxpQ0FBc0IsQ0FBQyxrQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDO0FBQzlILG9FQUFvRTtBQUN2RCxRQUFBLDBCQUEwQixHQUFHLGlDQUFzQixDQUFDLGtCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsbUJBQW9CLENBQUM7QUFDdEYsUUFBQSx1QkFBdUIsR0FBRyxpQ0FBc0IsQ0FBQyxrQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO0FBRWhGLFFBQUEseUJBQXlCLG1DQUNqQyx1QkFBdUIsQ0FBQyx3QkFBZSxDQUFDLEtBQzNDLENBQUMsa0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxpQ0FBc0IsQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLG9CQUFvQixFQUN6RSxDQUFDLGtCQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsaUNBQXNCLENBQUMsa0JBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxvQkFBb0IsRUFDN0YsQ0FBQyxrQkFBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLGlDQUFzQixDQUFDLGtCQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsb0JBQW9CLEVBQy9GLENBQUMsa0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxpQ0FBc0IsQ0FBQyxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixFQUMvRSxDQUFDLGtCQUFPLENBQUMsZUFBZSxDQUFDLEVBQUUsaUNBQXNCLENBQUMsa0JBQU8sQ0FBQyxl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