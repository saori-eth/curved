const { DB } = require("../DB");
const db = new DB();

(async () => {
  await db.createTable(
    "trades",
    `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      contentId INTEGER NOT NULL,
      ownershipPercentage REAL NOT NULL,
      tradeDate TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(contentId) REFERENCES content(id)
    `
  );

  await db.insert("trades", {
    // TODO
  });

  await db.fetchAll("users").then((rows) => console.log(rows));
})();
