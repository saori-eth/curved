source .env.local && \
forge script ../script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --private-key $LOCAL_PRIVATE_KEY --broadcast