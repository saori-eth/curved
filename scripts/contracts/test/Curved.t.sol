// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Curved} from "../src/Curved.sol";

contract CounterTest is Test {
    Curved curved;
    address curvedAddress;
    address owner = address(0x11);

    function setUp() public {
        vm.startPrank(owner);
        curved = new Curved(owner, 0.01 ether);
        curvedAddress = address(curved);
    }

    function testGetOwner() public {
        address deployer = curved.owner();
        assertEq(owner, deployer);
    }
}
