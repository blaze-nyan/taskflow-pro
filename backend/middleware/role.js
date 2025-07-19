const Role = require("../models/Role");
const roleCache = new Map();
function roleCheck(requiredRole) {
  return async function roleCheck(req, res, next) {
    const roleId = req.roleId;
    try {
      let role = roleCache.get(roleId);
      if (!role) {
        role = await Role.findById(roleId);
        if (role) {
          roleCache.set(roleId, role);
        }
      }
      if (!role) {
        return res.status(403).json({ message: "Role not found" });
      }
      if (role.name !== requiredRole) {
        return res.status(403).json({ message: "Access Denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  };
}
module.exports = roleCheck;
