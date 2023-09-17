// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "solady/tokens/ERC20.sol";

contract CurvedGovToken is ERC20 {
    string internal _name;
    string internal _symbol;
    uint8 internal _decimals;
    uint256 internal _totalSupply;
    address internal _handler;

    modifier onlyHandler() {
        require(msg.sender == _handler, "CurvedGovToken: only handler");
        _;
    }

    constructor() {
        _name = "Curved Governance Token";
        _symbol = "CGT";
        _decimals = 18;
        _totalSupply = 1_000_000_000 ether;
        _handler = msg.sender;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function mint(address to, uint256 amount) external onlyHandler {
        _mint(to, amount);
    }

    function transferHandler(address newHandler) external onlyHandler {
        _handler = newHandler;
    }
}
