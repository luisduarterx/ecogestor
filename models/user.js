import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";
import password from "./password";
import db from "node-pg-migrate/dist/db";
const create = async (userInputValues) => {
  await password.hash(userInputValues);

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
    throw new NotFoundError(
      "Não foi possivel encontrar esse usuário",
      "Tente novamente enviando um usuário válido",
    );
  }

  return result.rows[0];
};

const update = async (id, userInputValues) => {
  const currentUser = await findUserByID(id);

  if (userInputValues.email) {
    const uniqueEmail = await findUserByEmail(userInputValues.email);

    if (uniqueEmail) {
      throw new ValidationError(
        "O email informado já esta sendo utilizado.",
        "Utilize outro email para realizar essa operação.",
      );
    }
  }
  if (userInputValues.senha) {
    userInputValues = await password.hash(userInputValues);
  }

  const newUser = await database.query({
    text: `
        UPDATE
          users
        SET
          nome = COALESCE($4,nome),
          email = COALESCE($2,email),
          senha = COALESCE($3,senha),
          atualizado_em = timezone('utc', now())
        WHERE  
          id=$1
        RETURNING 
          *
        ;
    `,
    values: [
      id,
      userInputValues.email,
      userInputValues.senha,
      userInputValues.nome,
    ],
  });

  return newUser.rows[0];
};
const user = {
  create,
  findUserByID,
  update,
};

export default user;
