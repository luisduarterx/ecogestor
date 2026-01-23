import bcryptjs from "bcryptjs";

const hash = async (userInputValues) => {
  const salt = process.env.NODE_ENV === "production" ? 14 : 1;
  const newHash = await bcryptjs.hash(userInputValues.senha, salt);
  userInputValues.senha = newHash;
  return userInputValues;
};

const password = {
  hash,
};
export default password;
