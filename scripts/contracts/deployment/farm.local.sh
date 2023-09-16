#!/bin/bash
source .env &&
cd contracts &&
forge create --rpc-url "http://localhost:8545" \
    --private-key $LOCAL_PRIVATE_KEY \
    src/Farm.sol:Farm
