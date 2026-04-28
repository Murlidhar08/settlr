import { NextResponse } from 'next/server';
import packageJson from '@/package.json';
import { prisma } from '@/lib/prisma/prisma';

export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      status: 'ok',
      message: 'Server is healthy',
      version: packageJson.version,
      database: 'connected',
      timestamp: new Date().toISOString(),
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Server is unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      version: packageJson.version,
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}
