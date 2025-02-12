const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const { set } = require('date-fns');
const { dir } = require('node:console');
let counter = 0
const prisma = new PrismaClient();
function removeHtmlTags(instructions) {
    return instructions.replace(/<\/?[^>]+(>|$)/g, ""); // Remove all HTML tags
  }
async function addRecipesToDatabase() {
  try {
    const apiUrl = 'https://api.spoonacular.com/recipes/random?number=10&apiKey=69fe81e0c8e7484d80fc6a51924963d4';
    const response = await axios.get(apiUrl);

    const recipes = response.data.recipes;

    if (!recipes || recipes.length === 0) {
      console.error('No recipes fetched from the API.');
      return;
    }

    for (const recipe of recipes) {
      const ingredients = recipe.extendedIngredients
        ? recipe.extendedIngredients
            .map((ingredient) => `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`)
            .join(', ')
        : '';

        const cleanInstructions = removeHtmlTags(recipe.instructions);

      // Insert the recipe into the database
      await prisma.recipe.create({
        data: {
          title: recipe.title,
          image: recipe.image || null,
          ingredients: ingredients,
          instructions: cleanInstructions || 'No instructions provided.',
          prepTime: recipe.readyInMinutes || null, // Using readyInMinutes as prepTime
          cookTime: recipe.readyInMinutes || null, // Adjust if needed
          favoriteCount: 0, // Optional, since it defaults to 0
        },
      });

      console.log(`✅ Added recipe: ${recipe.title}`);
      counter++
      
    }
  } catch (error) {
    console.error('Error fetching or inserting recipes:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client disconnects
  }
}

setInterval(() => {
  addRecipesToDatabase();
  console.log("Total number of Recipes added:" +counter);
  
}, 3000);
// addRecipesToDatabase();
