import { prisma } from "@/lib/prisma"

// Default Data
async function main() {
    console.log("SEEDING COMPLETED...")
}

// Execution
main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})