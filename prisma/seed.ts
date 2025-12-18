import { prisma } from "@/lib/prisma"

// Default Data
async function main() {
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

    const business = await prisma.business.create({
        data: {
            name: "Dev Business",
            ownerId: 1,
        }
    })


    console.log({ business, devUser });
}

// Execution
main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})