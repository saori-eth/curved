#!/bin/bash
forge create --rpc-url "http://localhost:8545" \
    --constructor-args $LOCAL_DEPLOYER_ADDRESS "50000000000000000" \
    --private-key $LOCAL_PRIVATE_KEY \
    src/Curved.sol:Curved
