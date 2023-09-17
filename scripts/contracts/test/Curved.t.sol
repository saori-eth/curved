// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Curved} from "../src/Curved.sol";

contract CounterTest is Test {
    Curved curved;
    address curvedAddress;
    address owner = address(0x11);
    address[] users = [address(0x12), address(0x13), address(0x14)];

    modifier createShare() {
        // creates a share as user 0
        vm.stopPrank();
        vm.startPrank(users[0]);
        curved.createShare("ipfs://test");
        _;
    }

    modifier purchaseShare(uint256 amount) {
        // purchases user 0 as user 1
        vm.stopPrank();
        vm.startPrank(users[1]);
        uint256 targetId = curved.currentId() - 1;
        uint256 cost = curved.getBuyPriceAfterFee(targetId, amount);
        curved.buyShare{value: cost}(targetId, amount);
        _;
    }

    function setUp() public {
        vm.startPrank(owner);
        for (uint i = 0; i < users.length; i++) {
            vm.deal(users[i], 100 ether);
        }
        curved = new Curved(owner, 0.01 ether);
        curvedAddress = address(curved);
    }

    function testGetOwner() public {
        address deployer = curved.owner();
        assertEq(owner, deployer);
    }

    function testCreateShare() public {
        vm.stopPrank();
        vm.startPrank(users[0]);
        uint256 currentId = curved.currentId();
        curved.createShare("ipfs://test");
        (address _owner, uint256 _totalSupply, string memory _uri) = curved
            .shareInfo(currentId);
        assertEq(_owner, users[0]);
        assertEq(_totalSupply, 1);
        assertEq(_uri, "ipfs://test");
    }

    function testPurchaseAnotherUsersShare() public createShare {
        vm.stopPrank();
        vm.startPrank(users[1]);
        uint256 targetId = curved.currentId() - 1;
        uint256 cost = curved.getBuyPriceAfterFee(targetId, 1);
        curved.buyShare{value: cost}(targetId, 1);
        uint256 userBalance = curved.getShareBalance(targetId, users[1]);
        assertEq(userBalance, 1);
    }

    function testPurchaseManyShares() public createShare {
        vm.stopPrank();
        vm.startPrank(users[1]);
        uint256 targetId = curved.currentId() - 1;
        uint256 cost = curved.getBuyPriceAfterFee(targetId, 2);
        curved.buyShare{value: cost}(targetId, 2);
        uint256 userBalance = curved.getShareBalance(targetId, users[1]);
        assertEq(userBalance, 2);
    }

    function testSellSingleShare() public createShare purchaseShare(1) {
        uint256 targetId = curved.currentId() - 1;
        curved.sellShare(targetId, 1);
        uint256 userBalanceAfter = curved.getShareBalance(targetId, users[1]);
        assertEq(userBalanceAfter, 0);
    }

    function testSellManyShares() public createShare purchaseShare(2) {
        uint256 targetId = curved.currentId() - 1;
        curved.sellShare(targetId, 2);
        uint256 userBalanceAfter = curved.getShareBalance(targetId, users[1]);
        assertEq(userBalanceAfter, 0);
    }
}
