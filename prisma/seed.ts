import { prisma } from "@/lib/prisma"

// Default Data
async function main() {
  // Clear existing dev data
  const existingUser = await prisma.user.findUnique({ where: { email: 'dev@settlr.com' } });
  if (existingUser) {
    await prisma.transaction.deleteMany({ where: { business: { ownerId: existingUser.id } } });
    await prisma.financialAccount.deleteMany({ where: { business: { ownerId: existingUser.id } } });
    await prisma.party.deleteMany({ where: { business: { ownerId: existingUser.id } } });
    await prisma.business.deleteMany({ where: { ownerId: existingUser.id } });
    await prisma.account.deleteMany({ where: { userId: existingUser.id } });
  }

  // Default User -> Password is Dev@12345
  const devUser = await prisma.user.upsert({
    where: { email: 'dev@settlr.com' },
    update: {},
    create: {
      id: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
      email: 'dev@settlr.com',
      name: 'Dev User',
      contactNo: "9998887776",
      address: "Sample Address, Dev Enviroment, Settlr",
      image: null,
      twoFactorEnabled: false,
      banned: false,
      role: "admin"
    },
  });

  // Account
  const userAccount = await prisma.account.create({
    data: {
      id: "AYqiZ58F3ONPHkritzSDKhlO67pepkiV",
      accountId: devUser.id,
      // Password is Dev@12345
      password: "3abf22f72819f4f165753de5cfd12aa3:43241579192c4e4a7e3e730e338526cd6116c5f3b21a04f1403cc8895d0ea897262c5cb9637cbac05ce20580323a3abe2ebc45fd184bf88590b46f99ee6ac9d4",
      providerId: "credential",
      userId: devUser.id
    },
  });

  // Default Business
  const business = await prisma.business.createMany({
    data: [
      {
        id: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Dev Business",
        ownerId: devUser.id,
      },
      {
        id: "cmk2i5swn0001k4vedq9ch03i",
        name: "Settlr Business 1",
        ownerId: devUser.id,
      },
      {
        id: "cmk2i5xsi0002k4vei1rqitvo",
        name: "Settlr Business 2",
        ownerId: devUser.id,
      },
      {
        id: "cmk2i66yi0003k4vev0n5z4o8",
        name: "Settlr Business 3",
        ownerId: devUser.id,
      }
    ]
  })

  // List of Party
  const party = await prisma.party.createMany({
    data: [
      // ---------------- Customers ----------------
      {
        id: "cmk2i6xuz0004k4ve5hqq62kt",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Amit Traders",
        contactNo: "9876543201",
      },
      {
        id: "cmk2iuv4f0005k4veu99yhtlg",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Sharma Stores",
        contactNo: "9933445566",
      },
      {
        id: "cmk2iuyge0006k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Gupta Electronics",
        contactNo: "8585858585",
      },
      {
        id: "cmk2iuyge0007k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Mehta Supermarket",
        contactNo: "9090909090",
      },
      {
        id: "cmk2iuyge0008k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Kiran Enterprises",
        contactNo: "9123456780",
      },
      {
        id: "cmk2iuyge0009k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Ravi Construction",
        contactNo: "9988776655",
      },

      // ---------------- Suppliers ----------------
      {
        id: "cmk2iuyge0010k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Sagar Wholesales",
        contactNo: "9111223344",
      },
      {
        id: "cmk2iuyge0011k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Metro Distributors",
        contactNo: "9445566778",
      },
      {
        id: "cmk2iuyge0012k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Perfect Packaging",
        contactNo: "8800112233",
      },
      {
        id: "cmk2iuyge0013k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Fresh Farm Foods",
        contactNo: "9556677880",
      },
      {
        id: "cmk2iuyge0014k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Modern Stationery",
        contactNo: "9222334455",
      },

      // ---------------- Both (Customer + Supplier) ----------------
      {
        id: "cmk2jnitq0008o0veyg1yoebs",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Swift Logistics",
        contactNo: "9333445567",
      },
      {
        id: "cmk2jnitq0009o0veth4siz4x",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Prime Chemicals",
        contactNo: "8445566779",
      },
      {
        id: "cmk2jnitq000ao0veypmlavwx",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Royal Textiles",
        contactNo: "9009988776",
      },
    ]
  })

  // List of Financial Accounts
  const accounts = await prisma.financialAccount.createMany({
    data: [
      {
        id: "acc-cash-dev",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Cash",
        type: "MONEY",
        moneyType: "CASH",
        isSystem: true
      },
      {
        id: "acc-amit-dev",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Amit Traders",
        type: "PARTY",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
      },
      {
        id: "acc-sharma-dev",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Sharma Stores",
        type: "PARTY",
        partyId: "cmk2iuv4f0005k4veu99yhtlg",
      }
    ]
  })

  // List of Party
  const transactions = await prisma.transaction.createMany({
    data: [
      {
        amount: "344.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        fromAccountId: "acc-cash-dev",
        toAccountId: "acc-amit-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "172.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        fromAccountId: "acc-amit-dev",
        toAccountId: "acc-cash-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "622.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-15T18:30:00.000Z",
        fromAccountId: "acc-cash-dev",
        toAccountId: "acc-amit-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "65.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-15T18:30:00.000Z",
        fromAccountId: "acc-amit-dev",
        toAccountId: "acc-cash-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "93.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-11T18:30:00.000Z",
        fromAccountId: "acc-cash-dev",
        toAccountId: "acc-amit-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "344.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        fromAccountId: "acc-cash-dev",
        toAccountId: "acc-amit-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id,
        description: "Invoice #56"
      },
      {
        amount: "822.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-15T18:30:00.000Z",
        fromAccountId: "acc-amit-dev",
        toAccountId: "acc-cash-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id,
        description: "Fruits"
      },
      {
        amount: "344.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        fromAccountId: "acc-amit-dev",
        toAccountId: "acc-cash-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id,
        description: "Settled Up"
      },
      {
        amount: "350.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-01T18:30:00.000Z",
        fromAccountId: "acc-cash-dev",
        toAccountId: "acc-amit-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "36.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        fromAccountId: "acc-amit-dev",
        toAccountId: "acc-cash-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "40.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-01T18:30:00.000Z",
        fromAccountId: "acc-cash-dev",
        toAccountId: "acc-amit-dev",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: devUser.id
      },
      {
        amount: "650.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        fromAccountId: "acc-sharma-dev",
        toAccountId: "acc-cash-dev",
        partyId: "cmk2iuv4f0005k4veu99yhtlg",
        userId: devUser.id
      },
    ]
  })

  console.log({ business, devUser, userAccount, party, transactions });
}

// Execution
main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
