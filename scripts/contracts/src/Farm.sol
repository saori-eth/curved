// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Ownable} from "./Owner.sol";

contract Farm is Ownable {
    event Trade(
        address trader,
        uint256 sharesId,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 supply
    );

    // sharesId => (Holder => Balance)
    mapping(uint256 => mapping(address => uint256)) public sharesBalance;

    // sharesId => Supply
    mapping(uint256 => uint256) public sharesSupply;

    function getPrice(
        uint256 supply,
        uint256 amount
    ) public pure returns (uint256) {
        uint256 sum1 = supply == 0
            ? 0
            : ((supply - 1) * (supply) * (2 * (supply - 1) + 1)) / 6;
        uint256 sum2 = supply == 0 && amount == 1
            ? 0
            : ((supply - 1 + amount) *
                (supply + amount) *
                (2 * (supply - 1 + amount) + 1)) / 6;
        uint256 summation = sum2 - sum1;
        return (summation * 1 ether) / 16000;
    }

    function getBuyPrice(
        uint256 sharesId,
        uint256 amount
    ) public view returns (uint256) {
        return getPrice(sharesSupply[sharesId], amount);
    }

    function getSellPrice(
        uint256 sharesId,
        uint256 amount
    ) public view returns (uint256) {
        return getPrice(sharesSupply[sharesId] - amount, amount);
    }

    function createShares(
        uint256 sharesId,
        uint256 amount
    ) public onlyOwner {
        uint256 supply = sharesSupply[sharesId];
        require(supply == 0, "Shares already created");

        uint256 price = getPrice(supply, amount);
        sharesBalance[sharesId][msg.sender] =
            sharesBalance[sharesId][msg.sender] +
            amount;
        sharesSupply[sharesId] = supply + amount;

        emit Trade(
            msg.sender,
            sharesId,
            true,
            amount,
            price,
            supply + amount
        );
    }

    function buyShares(uint256 sharesId, uint256 amount) public payable {
        uint256 supply = sharesSupply[sharesId];
        require(supply > 0, "Shares not created yet");

        uint256 price = getPrice(supply, amount);
        require(msg.value >= price, "Insufficient payment");

        sharesBalance[sharesId][msg.sender] =
            sharesBalance[sharesId][msg.sender] +
            amount;
        sharesSupply[sharesId] = supply + amount;

        emit Trade(
            msg.sender,
            sharesId,
            true,
            amount,
            price,
            supply + amount
        );
    }

    function sellShares(uint256 sharesId, uint256 amount) public {
        uint256 supply = sharesSupply[sharesId];
        require(supply > amount, "Cannot sell the last share");
        uint256 price = getPrice(supply - amount, amount);
        require(
            sharesBalance[sharesId][msg.sender] >= amount,
            "Insufficient shares"
        );
        sharesBalance[sharesId][msg.sender] =
            sharesBalance[sharesId][msg.sender] -
            amount;
        sharesSupply[sharesId] = supply - amount;
        emit Trade(
            msg.sender,
            sharesId,
            false,
            amount,
            price,
            supply - amount
        );
        (bool success, ) = msg.sender.call{value: price}("");
        require(success, "Unable to send funds");
    }

    function getSharesBalance(uint256 sharesId, address holder)
        public
        view
        returns (uint256)
    {
        return sharesBalance[sharesId][holder];
    }

    function getSharesSupply(uint256 sharesId) public view returns (uint256) {
        return sharesSupply[sharesId];
    }

    
}
