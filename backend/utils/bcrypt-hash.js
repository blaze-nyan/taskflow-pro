const bcrypt = require("bcrypt");
const saltRounds = 10;
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
module.exports = hashPassword;
