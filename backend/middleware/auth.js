const { verifyAccessToken } = require("../utils/jwt");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: Token not Provided" });
  }
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "Access Denied: Invalid Token or Expired Token" });
  }
  req.userId = decoded.userId;
  req.roleId = decoded.roleId;
  next();
}
module.exports = authenticateToken;
