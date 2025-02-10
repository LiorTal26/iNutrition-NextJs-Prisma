const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const recipes = await prisma.recipe.findMany();
  console.log(recipes);
}

test().catch(console.error).finally(() => prisma.$disconnect());
