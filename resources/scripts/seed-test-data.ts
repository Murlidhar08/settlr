import { UserRole, UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";

async function main() {
  // 1. Get or create a test admin user
  let adminUser = await prisma.user.findFirst({ where: { role: UserRole.admin } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "admin@test.com",
        role: UserRole.admin,
        status: UserStatus.approved,
      },
    });
    console.log("Created test admin user:", adminUser.id);
  } else {
    console.log("Using existing admin user:", adminUser.id);
  }

  // 2. Create test regular user
  let regularUser = await prisma.user.findFirst({ where: { email: "user@test.com" } });
  if (!regularUser) {
    regularUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "user@test.com",
        role: UserRole.user,
        status: UserStatus.approved,
        contactNo: "1234567890",
      },
    });
    console.log("Created test regular user:", regularUser.id);
  } else {
    console.log("Using existing regular user:", regularUser.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
