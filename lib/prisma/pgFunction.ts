import { prisma } from "./prisma";

/**
 * Execute a PostgreSQL function with dynamic parameters
 *
 * @param fnName PostgreSQL function name
 * @param params Array of parameters
 * @returns Function result
 */
export async function executePgFunction<T = any>(fnName: string, params: any[] = []): Promise<T> {
    // $1, $2, $3 ...
    const placeholders = params.map((_, i) => `$${i + 1}`).join(", ");

    const query = `SELECT * FROM "${fnName}"(${placeholders});`;

    try {
        const result = await prisma.$queryRawUnsafe<T>(query, ...params);
        return result;
    } catch (error) {
        console.error(`Error executing function ${fnName}`, error);
        throw error;
    }
}
