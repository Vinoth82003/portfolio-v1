import bcrypt from "bcryptjs";
import Admin from "../../models/Admin";

export async function seedAdmin() {
  try {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      console.warn("ADMIN_USER or ADMIN_PASS not found in environment variables. Skipping admin seeding.");
      return;
    }

    const existingAdmin = await Admin.findOne({ email: adminUser });

    if (existingAdmin) {
      // console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPass, 12);

    const newAdmin = new Admin({
      email: adminUser,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("Admin account seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin account:", error);
  }
}
