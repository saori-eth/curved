// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Farm} from "../src/Farm.sol";

contract CounterTest is Test {
  Farm farm;
  address farmAddress;
  address owner = address(0x11);

    function setUp() public {
      vm.startPrank(owner);
      farm = new Farm();
      farmAddress = address(farm);
    }

    function testGetOwner() public {
      address deployer = farm.owner();
      assertEq(owner, deployer);
    }
}
