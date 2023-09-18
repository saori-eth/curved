const { DB } = require("../DB");
const db = new DB();

(async () => {
  await db.createTable(
    "auth",
    `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL UNIQUE,
      nonce TEXT NOT NULL,
      expiration TEXT NOT NULL
    `
  );
  await db.insert("auth", {
    address: "0x00000",
    nonce: "123456",
    expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  });
  await db.fetchAll("auth").then((rows) => console.log(rows));
})();
