# Curved

- bonding curves
- holders get ERC20 rewards
- claim any time or upon withdrawal
- drag and drop image upload
- websocket based feed of images with likes
- content and profile stored partly in sqlite3 and partly onchain
- optional IPFS content

```
- client (app)
  - next.js app router
  - rainbowkit, wagmi, viem
  - planetscale mysql2 cloud db
  - s3 content bucket via cloudflare r2
- scripts (web3)
  - contracts (forge)
  - ethers.js scripting
  - express ws for live feed of images
```

# Setup

```
cd app && npm run dev
```

```
cd scripts/contracts && forge install
```

```
cd scripts && npm run anvil
npm run deploy
```

```
cd database && npm run init
npm run start
```
