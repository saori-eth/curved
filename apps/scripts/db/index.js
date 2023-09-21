import { DB } from "./DB.js";

const db = new DB();

(async () => {
  const tables = await db.listTables();
  console.log(tables);
})();
