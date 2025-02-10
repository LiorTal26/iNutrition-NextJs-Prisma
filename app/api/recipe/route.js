import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Ensure dynamic handling
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query || query.trim() === '') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }


    // SQLite workaround for case-insensitive search
    const recipes = await prisma.recipe.findMany({
      where: {
        title: {
          contains: query.toLowerCase(),
        },
      },
      orderBy: { favoriteCount: 'desc' },
    });

  

    // Return a valid JSON response
    return NextResponse.json(recipes.length > 0 ? recipes : []);
  } catch (error) {
    console.error("Database query failed:", error.message);

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
