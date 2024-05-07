// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {Curved} from "../src/Curved.sol";
import {Yuyu} from "../src/Token.sol";


contract CurvedAltTest is Test {
    IERC20 _rewardToken;
    Curved _curved;
    address _curvedAddress;
    address _owner = address(0x11);
    uint256 _startTime;
    address[] _owners = [
        address(0x17),
        address(0x18),
        address(0x19),
        address(0x20)
    ];
    address[] _users = [
        address(0x12),
        address(0x13),
        address(0x14),
        address(0x15),
        address(0x16)
    ];
    mapping(address => uint256) _userPurchaseTimestamp;

    function setUp() public {
        vm.startPrank(_owner);
        for (uint i = 0; i < _users.length; i++) {
            vm.deal(_users[i], 100 ether);
        }

        Yuyu _tk = new Yuyu();
        _rewardToken = IERC20(address(_tk));

        _startTime = block.timestamp;
        _curved = new Curved(address(_rewardToken));
        _curvedAddress = address(_curved);

        _tk.addMinter(_curvedAddress);
        
        uint256 _ownerRewardTokenBalance = _rewardToken.balanceOf(_owner);
        assertEq(_ownerRewardTokenBalance, 2_000_000_000 ether);
        vm.stopPrank();
    }

    function testAmt() public {
        assertEq(_startTime, block.timestamp);
        vm.prank(_owner);
        _curved.createShare("test");
        vm.roll(block.number + 1);
        uint256 cost = _curved.getBuyPriceAfterFee(0, 1);
        vm.startPrank(_users[0]);
        _curved.buyShare{value: cost}(0, 1);

        // 1st year
        assertEq(_startTime, block.timestamp);
        vm.warp(block.timestamp + 52 weeks - 1);
        console2.log("earned", _curved.earned(_users[0]));
        assertEq(_curved.earned(_users[0]), 3999999872812372812366911573);
        _curved.getReward();
        // 2nd year
        vm.warp(block.timestamp + 52 weeks);
        vm.roll(block.number + 1);
        console2.log("earned", _curved.earned(_users[0]));
        assertEq(_curved.earned(_users[0]), 1599999999999999999972480000);
        _curved.getReward();
        // 3rd year
        vm.warp(block.timestamp + 52 weeks);
        vm.roll(block.number + 1);
        console2.log("earned", _curved.earned(_users[0]));
        assertEq(_curved.earned(_users[0]), 999999999999999999974937600);
        _curved.getReward();
        // 4th year
        vm.warp(block.timestamp + 52 weeks);
        vm.roll(block.number + 1);
        console2.log("earned", _curved.earned(_users[0]));
        assertEq(_curved.earned(_users[0]), 599999999999999999997542400);
        _curved.getReward();
        // 5th year
        vm.warp(block.timestamp + 52 weeks);
        vm.roll(block.number + 1);
        console2.log("earned", _curved.earned(_users[0]));
        assertEq(_curved.earned(_users[0]), 419999999999999999973120000);
        _curved.getReward();
        // 6th year
        vm.warp(block.timestamp + 52 weeks);
        vm.roll(block.number + 1);
        console2.log("earned", _curved.earned(_users[0]));
        assertEq(_curved.earned(_users[0]), 379999999999999999981670400);
        _curved.getReward();

        uint256 _totalEarned = 3999999872812372812366911573 + 1599999999999999999972480000 + 999999999999999999974937600 + 599999999999999999997542400 + 419999999999999999973120000 + 379999999999999999981670400;

        assertEq(_totalEarned, 7999999872812372812266661973);
        assertEq(_rewardToken.balanceOf(_users[0]), _totalEarned);

        vm.warp(block.timestamp + 52 weeks);
        vm.roll(block.number + 1);
        uint256 _earnedAfterEnd = _curved.earned(_users[0]);
        assertEq(_earnedAfterEnd, 0);
        
        // this wont revert but it also wont distribute any rewards
        _curved.getReward();
        assertEq(_rewardToken.balanceOf(_users[0]), _totalEarned);

        /*
        its only possible to get 7,999,999,872 tokens out of 8b
        might be reason for some of the results not being perfect
        the reason is, each year 1 second is basically skipped when the epoch changes
        so its supposed to be 4b the first year but the last second of the first year doesnt happen cause thats when it changes to the next epoch
        */
    }
}