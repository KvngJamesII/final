import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "./server/db";
import { users } from "./shared/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("200715", 10);
    const referralCode = nanoid(10);

    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.username, "idledev"));

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    const [admin] = await db
      .insert(users)
      .values({
        username: "idledev",
        password: hashedPassword,
        email: "admin@otpking.com",
        credits: 10000,
        referralCode,
        ipAddress: "127.0.0.1",
        isAdmin: true,
        isModerator: false,
      })
      .returning();

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: 200715`);
    console.log(`   Credits: ${admin.credits}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
