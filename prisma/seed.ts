import { prisma } from "@/lib/prisma"

// Default Data
async function main() {
    // Default User
    const devUser = await prisma.user.create({
        data: {
            email: 'dev@settlr.com',
            name: 'Dev User',
            password: "randomPassword",
            contactNo: "9998887776",
            address: "Sample Address, Dev Enviroment, Settlr",
            profileUrl: "https://i.pravatar.cc/300"
        },
    });

    // Default Business
    const business = await prisma.business.create({
        data: {
            name: "Dev Business",
            ownerId: 1,
        }
    })

    // Default Party
    const party = await prisma.party.createMany({
        data: [
            // ---------------- Customers ----------------
            {
                businessId: 1,
                name: "Amit Traders",
                contactNo: "9876543201",
                profileUrl: "https://i.pravatar.cc/301",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Sharma Stores",
                contactNo: "9933445566",
                profileUrl: "https://i.pravatar.cc/302",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Gupta Electronics",
                contactNo: "8585858585",
                profileUrl: "https://i.pravatar.cc/303",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Mehta Supermarket",
                contactNo: "9090909090",
                profileUrl: "https://i.pravatar.cc/304",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Kiran Enterprises",
                contactNo: "9123456780",
                profileUrl: "https://i.pravatar.cc/305",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Ravi Construction",
                contactNo: "9988776655",
                profileUrl: "https://i.pravatar.cc/306",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Star Medical",
                contactNo: "9099887766",
                profileUrl: "https://i.pravatar.cc/307",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Elite Fashion",
                contactNo: "9876501234",
                profileUrl: "https://i.pravatar.cc/308",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Blue Bakery",
                contactNo: "9000012345",
                profileUrl: "https://i.pravatar.cc/309",
                type: "CUSTOMER",
            },
            {
                businessId: 1,
                name: "Raj Auto Parts",
                contactNo: "9333888800",
                profileUrl: "https://i.pravatar.cc/310",
                type: "CUSTOMER",
            },

            // ---------------- Suppliers ----------------
            {
                businessId: 1,
                name: "Sagar Wholesales",
                contactNo: "9111223344",
                profileUrl: "https://i.pravatar.cc/311",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Metro Distributors",
                contactNo: "9445566778",
                profileUrl: "https://i.pravatar.cc/312",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Perfect Packaging",
                contactNo: "8800112233",
                profileUrl: "https://i.pravatar.cc/313",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Fresh Farm Foods",
                contactNo: "9556677880",
                profileUrl: "https://i.pravatar.cc/314",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Modern Stationery",
                contactNo: "9222334455",
                profileUrl: "https://i.pravatar.cc/315",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Techno Hardware",
                contactNo: "8899776655",
                profileUrl: "https://i.pravatar.cc/316",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Royal Textiles",
                contactNo: "9009988776",
                profileUrl: "https://i.pravatar.cc/317",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Agro Seeds Co.",
                contactNo: "8777665544",
                profileUrl: "https://i.pravatar.cc/318",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Swift Logistics",
                contactNo: "9333445567",
                profileUrl: "https://i.pravatar.cc/319",
                type: "SUPPLIER",
            },
            {
                businessId: 1,
                name: "Prime Chemicals",
                contactNo: "8445566779",
                profileUrl: "https://i.pravatar.cc/320",
                type: "SUPPLIER",
            },
        ]
    })

    console.log({ business, devUser, party });
}

// Execution
main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})