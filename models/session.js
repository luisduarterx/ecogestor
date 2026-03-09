import database from "infra/database";
import crypto from "node:crypto";

const create = async (userId) => {
  const token = crypto.randomBytes(48).toString("hex");
  const expiration_in_miliseconds = 60 * 60 * 24 * 1 * 1000; // 1 dia
  const expiresAt = new Date(Date.now() + expiration_in_miliseconds);

  console.log("token: ", token);

  const newSession = await insertQuery(token, userId, expiresAt);
  return newSession;
  async function insertQuery(token, userId, expiresAt) {
    const result = await database.query({
      text: `
            INSERT INTO
                sessions (token, user_id, expira_em)
            VALUES
            ($1, $2, $3)
            RETURNING
                *
            ;`,
      values: [token, userId, expiresAt],
    });

    console.log("SESISON:", result.rows[0]);
    return result.rows[0];
  }
};

const session = {
  create,
};

export default session;
