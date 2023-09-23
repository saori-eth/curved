// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Curved} from "../src/Curved.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CounterTest is Test {
    IERC20 _rewardToken;
    Curved _curved;
    address _curvedAddress;
    address _owner = address(0x11);
    address[] _users = [
        address(0x12),
        address(0x13),
        address(0x14),
        address(0x15),
        address(0x16)
    ];

    modifier createShare() {
        // creates a share as user 0
        vm.stopPrank();
        vm.startPrank(_users[0]);
        _curved.createShare("ipfs://test");
        _;
    }

    modifier purchaseShare(uint256 amount) {
        // purchases user 0 as user 1
        vm.stopPrank();
        vm.startPrank(_users[1]);
        uint256 targetId = _curved.currentId() - 1;
        uint256 cost = _curved.getBuyPriceAfterFee(targetId, amount);
        _curved.buyShare{value: cost}(targetId, amount);
        _;
    }

    modifier purchaseFromMany(uint256 users, uint256 amountPerUser) {
        vm.stopPrank();
        uint256 targetId = _curved.currentId() - 1;
        for (uint256 i = 0; i < users; i++) {
            uint256 cost = _curved.getBuyPriceAfterFee(targetId, amountPerUser);
            vm.prank(_users[i]);
            _curved.buyShare{value: cost}(targetId, amountPerUser);
        }
        _;
    }

    function setUp() public {
        vm.startPrank(_owner);
        for (uint i = 0; i < _users.length; i++) {
            vm.deal(_users[i], 100 ether);
        }
        _curved = new Curved(_owner, 0.01 ether);
        _curvedAddress = address(_curved);
        _rewardToken = IERC20(_curvedAddress);
        uint256 _ownerRewardTokenBalance = _rewardToken.balanceOf(_owner);
        assertEq(_ownerRewardTokenBalance, 2_000_000_000 ether);
    }

    function testGetOwner() public {
        address deployer = _curved.owner();
        assertEq(_owner, deployer);
    }

    function testCreateShare() public {
        vm.stopPrank();
        vm.startPrank(_users[0]);
        uint256 currentId = _curved.currentId();
        _curved.createShare("ipfs://test");
        (address __owner, uint256 _totalSupply, string memory _uri) = _curved
            .shareInfo(currentId);
        assertEq(__owner, _users[0]);
        assertEq(_totalSupply, 1);
        assertEq(_uri, "ipfs://test");
    }

    function testPurchaseAnotherUsersShare() public createShare {
        vm.stopPrank();
        vm.startPrank(_users[1]);
        uint256 targetId = _curved.currentId() - 1;
        uint256 cost = _curved.getBuyPriceAfterFee(targetId, 1);
        _curved.buyShare{value: cost}(targetId, 1);
        uint256 userBalance = _curved.getShareBalance(targetId, _users[1]);
        assertEq(userBalance, 1);
    }

    function testPurchaseManyShares() public createShare {
        vm.stopPrank();
        vm.startPrank(_users[1]);
        uint256 targetId = _curved.currentId() - 1;
        uint256 cost = _curved.getBuyPriceAfterFee(targetId, 2);
        _curved.buyShare{value: cost}(targetId, 2);
        uint256 userBalance = _curved.getShareBalance(targetId, _users[1]);
        assertEq(userBalance, 2);
    }

    function testSellSingleShare() public createShare purchaseShare(1) {
        uint256 targetId = _curved.currentId() - 1;
        _curved.sellShare(targetId, 1);
        uint256 userBalanceAfter = _curved.getShareBalance(targetId, _users[1]);
        assertEq(userBalanceAfter, 0);
    }

    function testSellManyShares() public createShare purchaseShare(2) {
        uint256 targetId = _curved.currentId() - 1;
        _curved.sellShare(targetId, 2);
        uint256 userBalanceAfter = _curved.getShareBalance(targetId, _users[1]);
        assertEq(userBalanceAfter, 0);
    }

    function testGetUserOwnedShares() public createShare {
        uint256[] memory ownedShares = _curved.getUserOwnedShares(_users[0]);
        assertEq(ownedShares.length, 1);
        assertEq(ownedShares[0], _curved.currentId() - 1);
    }

    function testGetRete() public {}

    function logRewardState() public view {
        console2.log("============== REWARD STATE ==============");
        console2.log("open interest: ", _curved.openInterest());
        console2.log("updatedAt: ", _curved.updatedAt());
        console2.log("rewardPerEthStored: ", _curved.rewardPerEthStored());
        console2.log("============== END REWARD STATE ==============");
    }

    function logUserRewardState(uint256 user) public view {
        console2.log("============== USER REWARD STATE ==============");
        console2.log("user: ", _users[user]);
        console2.log(
            "userEthContributed: ",
            _curved.userEthContributed(_users[user])
        );
        console2.log(
            "userRewardPerEthPaid: ",
            _curved.userRewardPerEthPaid(_users[user])
        );
        console2.log("rewards: ", _curved.rewards(_users[user]));
        console2.log("token balance: ", _rewardToken.balanceOf(_users[user]));
        console2.log("============== END USER REWARD STATE ==============");
    }

    function testClaimRewards() public createShare purchaseShare(1) {
        vm.warp(block.timestamp + 1 weeks);
        _curved.getReward();
    }

    function testClaimAsMany() public createShare purchaseFromMany(5, 1) {
        vm.warp(block.timestamp + 1 weeks);
        logRewardState();
        for (uint256 i = 0; i < _users.length; i++) {
            vm.prank(_users[i]);
            _curved.getReward();
            logUserRewardState(i);
        }
    }
}