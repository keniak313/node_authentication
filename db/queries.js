import { pool } from "./pool.js";

export const createUser = async (username, password) => {
  await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [
    username,
    password,
  ]);
};

export const checkIfUserExists = async (value) => {
  const { rows } = await pool.query(
    `SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ElSE FALSE END FROM users WHERE username = '${value}'`,
  );
  return rows[0].case;
};

export const getUsername = async (username) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return rows;
};

export const getUserId = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM users where id = $1`, [id]);
  return rows;
};

export const createMessage = async (userId, message, date) => {
  await pool.query(
    `INSERT INTO messages (user_id, message, date_added) VALUES($1, $2, $3)`,
    [userId, message, date],
  );
};

export const getAllMessages = async () => {
  const { rows } = await pool.query(
    `SELECT users.id AS user_id,messages.id AS message_id, username, message, date_added FROM messages JOIN users ON users.id = messages.user_id ORDER BY date_added desc`,
  );
  return rows;
};
