#!/bin/bash
forge create --rpc-url $GOERLI_HTTP_URL \
    --constructor-args $GOERLI_DEPLOYER_ADDRESS "25000000000000000" \
    --private-key $GOERLI_PRIVATE_KEY \
    src/Curved.sol:Curved
