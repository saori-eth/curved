const { DB } = require("../DB");
const db = new DB();

/*
 event Trade(
        uint256 id,
        uint256 side,
        address trader,
        address owner,
        uint256 amount,
        uint256 price,
        uint256 supply
    );
*/

(async () => {
  await db.createTable(
    "trades",
    `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shareId INTEGER NOT NULL,
      side INTEGER NOT NULL,
      trader INTEGER NOT NULL,
      owner INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      price STRING NOT NULL,
      supply INTEGER NOT NULL,
      FOREIGN KEY(trader) REFERENCES users(address),
      FOREIGN KEY(owner) REFERENCES content(owner)
    `
  );
})();
