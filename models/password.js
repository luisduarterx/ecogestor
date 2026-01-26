import bcryptjs from "bcryptjs";

const hash = async (userInputValues) => {
  const salt = process.env.NODE_ENV === "production" ? 14 : 1;
  const newHash = await bcryptjs.hash(userInputValues.senha, salt);
  userInputValues.senha = newHash;
  return userInputValues;
};
const compare = async (userInputValues) => {
  return await bcryptjs.compare(userInputValues.senha, userInputValues.hash);
};
const password = {
  hash,
  compare,
};
export default password;
