// pages/api/recipe/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { action } = req.body; // Expecting 'like' or 'favorite'

      // Find the recipe by ID
      const recipe = await prisma.recipe.findUnique({
        where: { id: parseInt(id) },
      });

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      // Increment the appropriate counter
      if (action === 'like') {
        const updatedRecipe = await prisma.recipe.update({
          where: { id: parseInt(id) },
          data: {
            likes: { increment: 1 },
          },
        });
        return res.status(200).json(updatedRecipe);
      } else if (action === 'favorite') {
        const updatedRecipe = await prisma.recipe.update({
          where: { id: parseInt(id) },
          data: {
            favorites: { increment: 1 },
          },
        });
        return res.status(200).json(updatedRecipe);
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
