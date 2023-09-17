// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Ownable} from "./Owner.sol";

contract Curved is Ownable {
    address public protocolFeeDestination; // 0.05 eth = 5%
    uint256 public protocolFeePercent; // 0.05 eth = 5%
    uint256 public curve = 4000;
    uint256 public currentId = 0;

    event ShareCreated(address indexed owner, uint256 indexed id);
    event Trade(
        uint256 id,
        uint256 side,
        address trader,
        address owner,
        uint256 amount,
        uint256 price,
        uint256 supply
    );

    struct Share {
        address owner;
        mapping(address => uint256) balances;
        uint256 totalSupply;
        string uri;
    }

    mapping(uint256 => Share) public shareInfo;

    constructor(address _protocolFeeDestination, uint256 _protocolFeePercent) {
        protocolFeeDestination = _protocolFeeDestination;
        protocolFeePercent = _protocolFeePercent;
    }

    function setProtocolFeeDestination(
        address _protocolFeeDestination
    ) external onlyOwner {
        protocolFeeDestination = _protocolFeeDestination;
    }

    function setProtocolFeePercent(
        uint256 _protocolFeePercent
    ) external onlyOwner {
        protocolFeePercent = _protocolFeePercent;
    }

    function getPrice(
        uint256 supply,
        uint256 amount
    ) public view returns (uint256) {
        uint256 sum1 = supply == 0
            ? 0
            : ((supply - 1) * (supply) * (2 * (supply - 1) + 1)) / 6;
        uint256 sum2 = supply == 0 && amount == 1
            ? 0
            : ((supply - 1 + amount) *
                (supply + amount) *
                (2 * (supply - 1 + amount) + 1)) / 6;
        uint256 summation = sum2 - sum1;
        return (summation * 1 ether) / curve;
    }

    function createShare(string calldata _uri) external {
        shareInfo[currentId].owner = msg.sender;
        shareInfo[currentId].balances[msg.sender] = 1;
        shareInfo[currentId].totalSupply = 1;
        shareInfo[currentId].uri = _uri;
        currentId++;
        emit ShareCreated(msg.sender, currentId - 1);
    }

    function buyShare(uint256 id, uint256 amount) external payable {
        require(id < currentId, "Invalid share id");
        Share storage share = shareInfo[id];
        uint256 supply = share.totalSupply;
        require(
            supply > 0 || share.owner == msg.sender,
            "Only the shares' subject can buy the first share"
        );
        uint256 price = getPrice(supply, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        require(msg.value >= price + protocolFee, "Insufficient payment");
        share.balances[msg.sender] = share.balances[msg.sender] + amount;
        share.totalSupply = supply + amount;
        emit Trade(id, 0, msg.sender, share.owner, amount, price, supply);
        (bool success1, ) = protocolFeeDestination.call{value: protocolFee}("");
        require(success1, "Unable to send funds");
    }

    function sellShare(uint256 id, uint256 amount) external {
        require(id < currentId, "Invalid share id");
        Share storage share = shareInfo[id];
        uint256 supply = share.totalSupply;
        require(
            share.balances[msg.sender] >= amount,
            "Insufficient share balance"
        );
        uint256 price = getPrice(supply, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        share.balances[msg.sender] = share.balances[msg.sender] - amount;
        share.totalSupply = supply - amount;
        emit Trade(id, 1, msg.sender, share.owner, amount, price, supply);
        (bool success1, ) = msg.sender.call{value: price - protocolFee}("");
        require(success1, "Unable to send funds");
        (bool success2, ) = protocolFeeDestination.call{value: protocolFee}("");
        require(success2, "Unable to send funds");
    }

    function uri(uint256 id) external view returns (string memory) {
        require(id < currentId, "Invalid share id");
        return shareInfo[id].uri;
    }

    function editUri(uint256 id, string calldata _uri) external {
        require(id < currentId, "Invalid share id");
        require(shareInfo[id].owner == msg.sender, "Only the owner can edit");
        shareInfo[id].uri = _uri;
    }
}
