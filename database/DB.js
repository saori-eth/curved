const sqlite3 = require("sqlite3");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { MODE } = process.env;

class DB {
  constructor() {
    this.path =
      MODE === "dev"
        ? path.join(__dirname, "dev.sqlite3")
        : path.join(__dirname, "prod.sqlite3");
    this.db = new sqlite3.Database(this.path);
  }

  // Example: createTable('users', 'id INTEGER PRIMARY KEY, name TEXT, age INTEGER')
  createTable(table, schema) {
    return new Promise((resolve, reject) => {
      this.db.run(`CREATE TABLE IF NOT EXISTS ${table}(${schema})`, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  // Example: insert('users', {name: 'John', age: 30})
  insert(table, data) {
    const columns = Object.keys(data).join(",");
    const values = Object.values(data)
      .map((value) => `'${value}'`)
      .join(",");
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO ${table} (${columns}) VALUES (${values})`,
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  fetchAll(table) {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  // Example: fetchOne('users', 'name = "John"')
  fetchOne(table, condition) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM ${table} WHERE ${condition}`, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  // Example: update('users', {name: 'Jane'}, 'id = 1')
  update(table, data, condition) {
    const setData = Object.keys(data)
      .map((key) => `${key} = '${data[key]}'`)
      .join(",");
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${table} SET ${setData} WHERE ${condition}`,
        function (err) {
          if (err) reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  // Example: delete('users', 'id = 1')
  delete(table, condition) {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM ${table} WHERE ${condition}`, function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  }

  dropTable(table) {
    return new Promise((resolve, reject) => {
      this.db.run(`DROP TABLE ${table}`, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = { DB };
