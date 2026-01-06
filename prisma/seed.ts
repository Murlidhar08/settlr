import { prisma } from "@/lib/prisma"

// Default Data
async function main() {
  // Default User -> Password is Dev@12345
  const devUser = await prisma.user.create({
    data: {
      id: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
      email: 'dev@settlr.com',
      name: 'Dev User',
      contactNo: "9998887776",
      address: "Sample Address, Dev Enviroment, Settlr",
      image: "https://i.pravatar.cc/300",
      twoFactorEnabled: false
    },
  });

  // Account
  const userAccount = await prisma.account.create({
    data: {
      id: "AYqiZ58F3ONPHkritzSDKhlO67pepkiV",
      accountId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
      // Password is Dev@12345
      password: "3abf22f72819f4f165753de5cfd12aa3:43241579192c4e4a7e3e730e338526cd6116c5f3b21a04f1403cc8895d0ea897262c5cb9637cbac05ce20580323a3abe2ebc45fd184bf88590b46f99ee6ac9d4",
      providerId: "credential",
      userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
    },
  });

  // Default Business
  const business = await prisma.business.createMany({
    data: [
      {
        id: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Dev Business",
        ownerId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
      },
      {
        id: "cmk2i5swn0001k4vedq9ch03i",
        name: "Settlr Business 1",
        ownerId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
      },
      {
        id: "cmk2i5xsi0002k4vei1rqitvo",
        name: "Settlr Business 2",
        ownerId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
      },
      {
        id: "cmk2i66yi0003k4vev0n5z4o8",
        name: "Settlr Business 3",
        ownerId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
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
        profileUrl: "https://i.pravatar.cc/301",
        type: "CUSTOMER",
      },
      {
        id: "cmk2iuv4f0005k4veu99yhtlg",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Sharma Stores",
        contactNo: "9933445566",
        profileUrl: "https://i.pravatar.cc/302",
        type: "CUSTOMER",
      },
      {
        id: "cmk2iuyge0006k4vemzxjm6eo",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Gupta Electronics",
        contactNo: "8585858585",
        profileUrl: "https://i.pravatar.cc/303",
        type: "CUSTOMER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Mehta Supermarket",
        contactNo: "9090909090",
        profileUrl: "https://i.pravatar.cc/304",
        type: "CUSTOMER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Kiran Enterprises",
        contactNo: "9123456780",
        profileUrl: "https://i.pravatar.cc/305",
        type: "CUSTOMER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Ravi Construction",
        contactNo: "9988776655",
        profileUrl: "https://i.pravatar.cc/306",
        type: "CUSTOMER",
      },

      // ---------------- Suppliers ----------------
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Sagar Wholesales",
        contactNo: "9111223344",
        profileUrl: "https://i.pravatar.cc/311",
        type: "SUPPLIER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Metro Distributors",
        contactNo: "9445566778",
        profileUrl: "https://i.pravatar.cc/312",
        type: "SUPPLIER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Perfect Packaging",
        contactNo: "8800112233",
        profileUrl: "https://i.pravatar.cc/313",
        type: "SUPPLIER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Fresh Farm Foods",
        contactNo: "9556677880",
        profileUrl: "https://i.pravatar.cc/314",
        type: "SUPPLIER",
      },
      {
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Modern Stationery",
        contactNo: "9222334455",
        profileUrl: "https://i.pravatar.cc/315",
        type: "SUPPLIER",
      },

      // ---------------- Both (Customer + Supplier) ----------------
      {
        id: "cmk2jnitq0008o0veyg1yoebs",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Swift Logistics",
        contactNo: "9333445567",
        profileUrl: "https://i.pravatar.cc/319",
        type: "BOTH",
      },
      {
        id: "cmk2jnitq0009o0veth4siz4x",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Prime Chemicals",
        contactNo: "8445566779",
        profileUrl: "https://i.pravatar.cc/320",
        type: "BOTH",
      },
      {
        id: "cmk2jnitq000ao0veypmlavwx",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        name: "Royal Textiles",
        contactNo: "9009988776",
        profileUrl: "https://i.pravatar.cc/317",
        type: "BOTH",
      },
    ]
  })

  // List of Party
  const transactions = await prisma.transaction.createMany({
    data: [
      {
        amount: "344.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        direction: "OUT",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "172.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        direction: "IN",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "622.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-15T18:30:00.000Z",
        direction: "OUT",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "65.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-15T18:30:00.000Z",
        direction: "IN",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "93.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-11T18:30:00.000Z",
        direction: "OUT",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "344.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        direction: "OUT",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
        description: "Invoice #56"
      },
      {
        amount: "822.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2025-12-15T18:30:00.000Z",
        direction: "IN",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
        description: "Fruits"
      },
      {
        amount: "344.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        direction: "IN",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu",
        description: "Settled Up"
      },
      {
        amount: "350.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-01T18:30:00.000Z",
        direction: "OUT",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "36.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        direction: "IN",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "40.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-01T18:30:00.000Z",
        direction: "OUT",
        mode: "CASH",
        partyId: "cmk2i6xuz0004k4ve5hqq62kt",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
      },
      {
        amount: "650.00",
        businessId: "cmk2i4nnn0000k4vercnwxr8w",
        date: "2026-01-05T18:30:00.000Z",
        direction: "IN",
        mode: "CASH",
        partyId: "cmk2iuv4f0005k4veu99yhtlg",
        userId: "UvOchG90zgQfSouPvYqg4kiNHqmifplu"
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
