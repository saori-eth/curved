// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Farm} from "../src/Farm.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();
        new Farm();
    }
}
