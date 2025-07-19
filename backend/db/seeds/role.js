const Role = require("../../models/Role");
const roleData = [{ name: "user" }, { name: "admin" }];
async function seedRole() {
  try {
    for (const roleInfo of roleData) {
      const existingRole = await Role.findOne(roleInfo);
      if (!existingRole) {
        const newRole = new Role(roleInfo);
        const savedRole = await newRole.save();
        if (!savedRole) {
          console.log(`Fail to create ${roleInfo.name} role`);
        } else {
          console.log(`${roleInfo.name} role created`);
        }
      } else {
        console.log(`${roleInfo.name} role is already existed`);
      }
    }
  } catch (error) {
    console.log({ message: "Role Seeding error" });
  }
}
module.exports = seedRole;
