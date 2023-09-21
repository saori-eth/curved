import { DB } from "../DB.js";
const db = new DB();

(async () => {
  await db.createTable(
    "trades",
    `
      id INT PRIMARY KEY AUTO_INCREMENT,
      shareId INT NOT NULL,
      side INT NOT NULL,
      trader VARCHAR(255) NOT NULL,
      owner VARCHAR(255) NOT NULL,
      amount INT NOT NULL,
      price VARCHAR(255) NOT NULL,
      supply INT NOT NULL
    `
  );

  const rows = await db.fetchAll("trades");
  console.log(rows);
  db.close();
})();
