// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Curved} from "../src/Curved.sol";
import {YuYu} from "../src/Token.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FuzzyTest is Test {
    IERC20 _rewardToken;
    Curved _curved;
    address _curvedAddress;
    address _owner = address(0x11);
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
        _rewardToken = new YuYu();
        _curvedAddress = address(_rewardToken);
        _curved = new Curved(_curvedAddress);
        uint256 _ownerRewardTokenBalance = _rewardToken.balanceOf(_owner);
        assertEq(_ownerRewardTokenBalance, 2_000_000_000 ether);
        vm.stopPrank();
    }

    function _createShare(address owner) internal returns (uint256) {
        vm.startPrank(owner);
        uint256 currentId = _curved.currentId();
        _curved.createShare("ipfs://test");
        vm.stopPrank();
        // (address __owner, uint256 _totalSupply, string memory _uri) = _curved
        //     .shareInfo(currentId);
        return currentId;
    }

    function _purchaseShare(address buyer, uint256 shareId) internal {
        vm.startPrank(buyer);
        uint256 cost = _curved.getBuyPriceAfterFee(shareId, 1);
        _curved.buyShare{value: cost}(shareId, 1);
        vm.stopPrank();
        _userPurchaseTimestamp[buyer] = block.timestamp;
        // uint256 userBalance = _curved.getShareBalance(shareId, buyer);
        // assertEq(userBalance, 1);
    }

    function _purchaseManyShares(address buyer, uint256 shareId, uint256 amt) internal {
        vm.startPrank(buyer);
        uint256 cost = _curved.getBuyPriceAfterFee(shareId, amt);
        _curved.buyShare{value: cost}(shareId, amt);
        // uint256 userBalance = _curved.getShareBalance(shareId, buyer);
        _userPurchaseTimestamp[buyer] = block.timestamp;
        vm.stopPrank();
        // assertEq(userBalance, 2);
    }

    function _sellSingleShare(address owner, uint256 shareId) internal {
        vm.startPrank(owner);
        _curved.sellShare(shareId, 1);
        // uint256 userBalanceAfter = _curved.getShareBalance(shareId, owner);
        vm.stopPrank();
        // assertEq(userBalanceAfter, 0);
    }

    function _sellManyShares(address owner, uint256 shareId, uint256 amt) internal {
        vm.startPrank(owner);
        _curved.sellShare(shareId, amt);
        // uint256 userBalanceAfter = _curved.getShareBalance(shareId, owner);
        vm.stopPrank();
        // assertEq(userBalanceAfter, 0);
    }

    function _purchaseFromMany(uint256 shareId, uint256 users, uint256 amountPerUser) internal {
        for (uint256 i = 0; i < users; i++) {
            uint256 cost = _curved.getBuyPriceAfterFee(shareId, amountPerUser);
            vm.prank(_users[i]);
            _curved.buyShare{value: cost}(shareId, amountPerUser);
            _userPurchaseTimestamp[_users[i]] = block.timestamp;
        }
    }

    function testGetRete() public {
      uint256 start = _curved.startTime();
      uint256[6] memory _years = [
        start + 1,
        start + 365 days,
        start + 2 * 365 days,
        start + 3 * 365 days,
        start + 4 * 365 days,
        start + 5 * 365 days
      ];

      uint256[6] memory _yearsRates = [
        _curved.getRate(start + 1),
        _curved.getRate(start + 365 days),
        _curved.getRate(start + 2 * 365 days),
        _curved.getRate(start + 3 * 365 days),
        _curved.getRate(start + 4 * 365 days),
        _curved.getRate(start + 5 * 365 days)
      ];

      uint256[6] memory _expectedTokenomics = [
        uint256(127187627187627187627), // 127.19 per second
        uint256(50875050875050875050),  // 50.87 per second
        uint256(31796906796906796906),  // 31.80 per second
        uint256(19078144078144078144),  // 19.08 per second
        uint256(13354700854700854700),  // 13.35 per second
        uint256(12082824582824582824)   // 12.08 per second
      ];

      // assert rates are what we expect (numbers above);
      for (uint256 i = 0; i < _yearsRates.length; i++) {
        assertEq(_yearsRates[i], _expectedTokenomics[i]);
      }

      // assert rates are correct on block.timestamp
      for (uint256 i = 0; i < _years.length; i++) {
        vm.warp(_years[i]);
        assertEq(_curved.getRate(block.timestamp), _yearsRates[i]);
      }
    }

    function testAccurateReward() public {
        address owner = _users[0];
        address buyer = _users[1];

        uint256 _sid = _createShare(owner);
        _purchaseShare(buyer, _sid);

        uint256 targetTime = _userPurchaseTimestamp[buyer] + 52 weeks;
        vm.warp(targetTime);

        vm.prank(buyer);
        _curved.getReward();
        
        uint256 userClaimTimestamp = block.timestamp;
        uint256 earnedDuration = userClaimTimestamp -
            _userPurchaseTimestamp[buyer];
        uint256 currentRate = _curved.getRate(userClaimTimestamp);
        uint256 expectedReward = earnedDuration * currentRate;
        uint256 userRewardBalance = _rewardToken.balanceOf(buyer);
        assertEq(userRewardBalance, expectedReward);
    }

    function testAccurateRewardAsManyInDiffPools(uint256 amt0, uint256 amt1) public {
        vm.assume(amt0 > 10);
        vm.assume(amt1 > 10);
        
        // vm.assume(amt0 < 100);
        // vm.assume(amt1 < 50);

        uint256 _sid0 = _createShare(_users[0]);
        uint256 _sid1 = _createShare(_users[1]);

        _purchaseShare(_users[0], _sid1);
        _purchaseShare(_users[1], _sid0);

        _purchaseManyShares(_users[0], _sid1, amt1);
        _purchaseManyShares(_users[1], _sid0, amt0);

        uint256 totalDeposit = _curved.totalVolume();

        uint256 targetTime = _userPurchaseTimestamp[_users[1]] + 1 weeks;
        vm.warp(targetTime);
        uint256 currentRate = _curved.getRate(block.timestamp);

        for (uint256 i = 0; i < 2; i++) {
            vm.prank(_users[i]);
            _curved.getReward();

            uint256 earnedDuration = block.timestamp - _userPurchaseTimestamp[_users[i]];
            uint256 userDeposit = _curved.userVolume(_users[i]);
            uint256 expectedReward;
            
            if (userDeposit <= 0) {
                expectedReward = 0;
            } else {
                expectedReward = (earnedDuration * currentRate * uint(userDeposit)) /
                    totalDeposit;
            }
            
            
            uint256 userRewardBalance = _rewardToken.balanceOf(_users[i]);
            console2.log('------------------------------');
            console2.log('user', i);
            console2.log('amt shares bought', _curved.getShareBalance(i == 0 ? _sid1 : _sid0, _users[i]));
            console2.log('balanceOf', userRewardBalance);
            console2.log('expectedReward', expectedReward);
            assertEq(userRewardBalance, expectedReward);
        }
        
    }

    function testRewardProportionSamePool() public {
        address owner = _users[0];
        uint256 users = 2;
        uint256 amt = 1;

        uint256 _sid = _createShare(owner);
        _purchaseFromMany(_sid, users, amt);

        uint256 totalDeposit = _curved.totalVolume();
        uint256 targetTime = _userPurchaseTimestamp[_users[users - 1]] + 1 weeks;
        vm.warp(targetTime);
        uint256 currentRate = _curved.getRate(block.timestamp);

        for (uint256 i = 0; i < 2; i++) {
            vm.prank(_users[i]);
            _curved.getReward();
            uint256 earnedDuration = block.timestamp -
                _userPurchaseTimestamp[_users[i]];
            uint256 userDeposit = _curved.userVolume(_users[i]);
            uint256 expectedReward;
            if (userDeposit < 0) {
                expectedReward = 0;
            } else {
                expectedReward = (earnedDuration * currentRate * uint(userDeposit)) /
                    totalDeposit;
            }
            uint256 userRewardBalance = _rewardToken.balanceOf(_users[i]);
            assertEq(userRewardBalance, expectedReward);
        }
    }

    function testClaimOnSell() public {
        address owner = _users[0];
        address buyer = _users[1];

        uint256 _sid = _createShare(owner);
        _purchaseShare(buyer, _sid);

        uint256 targetTime = _userPurchaseTimestamp[buyer] + 51 weeks;
        vm.warp(targetTime);
        vm.roll(block.number + 1);
        uint256 earnedBeforeSell = _curved.earned(buyer);
        vm.startPrank(buyer);
        
        _curved.sellShare(0, 1);
        uint256 earnedAfterSell = _curved.earned(buyer);
        uint256 balanceAfterSell = _rewardToken.balanceOf(buyer);
        assertEq(earnedBeforeSell, earnedAfterSell);
        assertEq(balanceAfterSell, 0);

        _curved.getReward();
        vm.stopPrank();

        uint256 balanceAfterClaim = _rewardToken.balanceOf(buyer);
        uint256 earnedAfterClaim = _curved.earned(buyer);
        assertEq(balanceAfterClaim, earnedBeforeSell);
        assertEq(earnedAfterClaim, 0);
    }

    function testRoyaltyFees() public {
      address owner = _users[0];
      address buyer = _users[1];

      uint256 _sid = _createShare(owner);

      // royalty fees should be 5% of getPrice() and send to the share owner
      uint256 royaltyFee = _curved.royaltyFeePercent();
      uint256 realCost = _curved.getBuyPrice(_sid, 1);
      uint256 expectedRoyaltyFee = realCost * royaltyFee / 1 ether;
      uint256 ownerBalanceBefore = owner.balance;
      
      _purchaseShare(buyer, _sid);

      uint256 ownerBalanceAfter = owner.balance;
      assertEq(ownerBalanceAfter - ownerBalanceBefore, expectedRoyaltyFee);
    }
}