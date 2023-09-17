const { DB } = require("../DB");
const db = new DB();

(async () => {
  await db.createTable(
    "users",
    `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      address TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      avatar TEXT NOT NULL
    `
  );

  await db.insert("users", {
    username: "admin",
    address: "0x00000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: "https://i.imgur.com/3GvwN8w.png",
  });

  await db.fetchAll("users").then((rows) => console.log(rows));
})();
