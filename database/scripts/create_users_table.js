const { DB } = require("../DB");
const db = new DB();

function formatDateToMySQLDateTime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

(async () => {
  await db.createTable(
    "users",
    `
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL UNIQUE,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      avatar TEXT NOT NULL
    `
  );

  await db.insert("users", {
    username: "admin",
    address: "0x00000",
    createdAt: formatDateToMySQLDateTime(new Date()),
    updatedAt: formatDateToMySQLDateTime(new Date()),
    avatar: "https://i.imgur.com/3GvwN8w.png",
  });

  const rows = await db.fetchAll("users");
  console.log(rows);
  db.close();
})();
