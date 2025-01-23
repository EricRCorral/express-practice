import { createConnection } from "mysql2/promise";

const DEFAULT_CONFIG = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "password",
  database: "movies_db",
};

const CONNECTION = await createConnection(
  process.env.DATABASE_URL ?? DEFAULT_CONFIG
);

export default class MovieModel {
  static getAll = async ({ year, rate, title }) => {
    try {
      const [movies] = await CONNECTION.query(
        `SELECT BIN_TO_UUID(id) id, title, year, rate , url FROM movies WHERE 
        (? IS NULL OR year = ?) AND 
        (? IS NULL OR rate >= ?) AND 
        (? IS NULL OR title LIKE ?);`,
        [year, year, rate, rate, title, "%" + title + "%"]
      );

      return movies;
    } catch (error) {
      console.log(error);
    }
  };

  static create = async ({ data }) => {
    try {
      await CONNECTION.query(
        `INSERT INTO movies (title, year, rate , url) VALUES
          (? , ? , ?, ?)`,
        [data.title, data.year, data.rate, data.url]
      );
    } catch (error) {
      console.log(error);
    }

    return data;
  };

  static getById = async ({ id }) => {
    try {
      const [movies] = await CONNECTION.query(
        `SELECT BIN_TO_UUID(id) id, title, year, rate , url FROM movies WHERE id = UUID_TO_BIN(?)`,
        [id]
      );

      return movies[0];
    } catch (error) {
      console.log(error);
    }
  };

  static delete = async ({ id }) => {
    try {
      const [headers] = await CONNECTION.query(
        "DELETE FROM movies WHERE id = UUID_TO_BIN(?)",
        [id]
      );

      if (headers.affectedRows !== 1) return false;
    } catch (error) {
      console.log(error);
    }
  };

  static update = async ({ id, data }) => {
    try {
      const [headers] = await CONNECTION.query(
        `
        UPDATE movies
        SET title = ? , year = ? , rate = ? , url = ?
        WHERE id = UUID_TO_BIN(?)
        `,
        [data.title, data.year, data.rate, data.url, id]
      );

      if (headers.affectedRows !== 1) return false;
    } catch (error) {
      console.log(error);
    }
  };
}
