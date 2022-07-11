// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library ConversionRate {
    
    function ethToUsd(AggregatorV3Interface priceFeedAddress) internal view returns(uint256) {
        // Address eth/usd  Rinkeby: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        // ABI
        //AggregatorV3Interface currentPrice = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        (, int256 answer,,,) = priceFeedAddress.latestRoundData();     
        // this will give us eth price in USD
        return uint256(answer * 1e10);
    }

    // function getVersion() internal view returns(uint256) {
    //     AggregatorV3Interface currentPrice = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    //     return currentPrice.version();
    // }

    function conversionOfEth(uint256 _ethAmount, AggregatorV3Interface priceFeedAddress) internal view returns(uint256) {
        uint256 ethPrice = ethToUsd(priceFeedAddress);
        uint256 amountInUsd = (ethPrice * _ethAmount) / 1e18;
        return amountInUsd;

    }

}