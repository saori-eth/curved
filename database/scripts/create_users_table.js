const { DB } = require("../DB");
const db = new DB();

(async () => {
  await db.createTable(
    "users",
    `
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    `
  );

  await db.insert("users", {
    username: "user1",
    address: "0x123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await db.fetchAll("users").then((rows) => console.log(rows));
})();
