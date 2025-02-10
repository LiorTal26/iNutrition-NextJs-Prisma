import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        favoriteCount: { increment: 1 },
      },
    });

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating favorite count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
