import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const { MODE, DEV_DATABASE_URL, DATABASE_URL } = process.env;

const dbUrl = MODE === "dev" ? DEV_DATABASE_URL : DATABASE_URL;

console.log("dbUrl", dbUrl);

export class DB {
  constructor() {
    this.connection = mysql.createConnection(dbUrl);
  }

  createTable(table, schema) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `CREATE TABLE IF NOT EXISTS ${table}(${schema})`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });
  }

  insert(table, data) {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).join(",");
      const placeholders = Object.keys(data)
        .map(() => "?")
        .join(",");
      const values = Object.values(data);
      this.connection.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });
  }

  fetchAll(table) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  fetchAllConditional(table, condition) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM ${table} WHERE ${condition}`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });
  }

  fetchOne(table, condition) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM ${table} WHERE ${condition}`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        },
      );
    });
  }

  update(table, data, condition) {
    return new Promise((resolve, reject) => {
      const setData = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(",");
      const values = Object.values(data);
      this.connection.query(
        `UPDATE ${table} SET ${setData} WHERE ${condition}`,
        values,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });
  }

  delete(table, condition) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `DELETE FROM ${table} WHERE ${condition}`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        },
      );
    });
  }

  listTables() {
    return new Promise((resolve, reject) => {
      this.connection.query("SHOW TABLES", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  dropTable(table) {
    return new Promise((resolve, reject) => {
      this.connection.query(`DROP TABLE ${table}`, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  close() {
    this.connection.end();
  }

  getUserBalances(address) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT
        shareId,
        SUM(CASE WHEN side = 0 THEN amount ELSE 0 END) - SUM(CASE WHEN side = 1 THEN amount ELSE 0 END) as balance
      FROM trades
      WHERE trader = ?
      GROUP BY shareId`,
        [address],
        (err, results) => {
          if (err) reject(err);
          else resolve(results.filter((row) => row.balance !== "0"));
        },
      );
    });
  }

  getAllUserBalances() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT 
          trader, 
          shareId,
          SUM(CASE WHEN side = 0 THEN amount ELSE 0 END) - SUM(CASE WHEN side = 1 THEN amount ELSE 0 END) as balance
        FROM trades 
        GROUP BY trader, shareId
        ORDER BY trader, shareId, balance`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results.filter((row) => row.balance !== "0"));
        },
      );
    });
  }
}
