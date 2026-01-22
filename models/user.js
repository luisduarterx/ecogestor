import database from "infra/database";
import { ValidationError } from "infra/errors";
const create = async (userInputValues) => {
  const userExist = await findUserByEmail(userInputValues.email);
  if (userExist) {
    throw new ValidationError(
      "Não é possivel criar um usuário com um email já cadastrado.",
    );
  }
  const result = await database.query({
    text: `
                INSERT INTO 
                    users (nome,email,senha) 
                VALUES 
                    ($1,$2,$3)
                RETURNING
                    *
                ;`,
    values: [
      userInputValues.nome,
      userInputValues.email.toLowerCase(),
      userInputValues.senha,
    ],
  });

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await database.query({
    text: `
      SELECT * FROM users WHERE LOWER(email) = LOWER($1); 
    `,
    values: [email],
  });

  return result.rows[0];
};
const findUserByID = async (id) => {
  const result = await database.query({
    text: `
      SELECT * FROM users WHERE id = $1 LIMIT 1; 
    `,
    values: [id],
  });

  if (!result.rows[0]) {
    throw new ValidationError(
      "Não foi possivel encontrar esse usuário",
      "Tente novamente enviando um usuário válido",
    );
  }

  return result.rows[0];
};
const user = {
  create,
  findUserByID,
};

export default user;
