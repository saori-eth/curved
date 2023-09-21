import dotenv from "dotenv";
import mysql from "mysql2";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const { MODE, DEV_DATABASE_URL, DATABASE_URL } = process.env;

const dbUrl = MODE === "dev" ? DEV_DATABASE_URL : DATABASE_URL;

console.log("dbUrl", dbUrl);

export class DB {
  connection: mysql.Connection;

  constructor() {
    if (!dbUrl) {
      throw new Error("Database URL not found");
    }

    this.connection = mysql.createConnection(dbUrl);
  }

  createTable(table: string, schema: string) {
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

  insert(table: string, data: Record<string, any>) {
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

  fetchAll(table: string) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  fetchAllConditional(table: string, condition: string) {
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

  fetchOne(table: string, condition: string) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM ${table} WHERE ${condition}`,
        (err, results) => {
          if (err) {
            reject(err);
          } else if (Array.isArray(results)) {
            resolve(results[0]);
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  update(table: string, data: Record<string, any>, condition: string) {
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

  delete(table: string, condition: string) {
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

  dropTable(table: string) {
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

  getUserBalances(address: string) {
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
          if (err) {
            reject(err);
          } else {
            // @ts-expect-error
            resolve(results.filter((row) => row.balance !== "0"));
          }
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
          if (err) {
            reject(err);
          } else {
            // @ts-expect-error
            resolve(results.filter((row) => row.balance !== "0"));
          }
        },
      );
    });
  }
}
