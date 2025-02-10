'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card'; // Make sure you import Card if needed

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch recipes from the API
  const fetchRecipes = async () => {
    setLoading(true);  // Start loading
    const res = await fetch(`/api/recipes?query=${query}`);
    const data = await res.json();
    setRecipes(data);
    setLoading(false); // End loading
  };

  // Handle the favorite button click
  const handleFavorite = async (id) => {
    await fetch('/api/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchRecipes(); // Refresh the list after adding to favorites
  };
  use
  useEffect(() => {
    if (query.trim()) {
      fetchRecipes();
    }
  }, [query, fetchRecipes]);

  // Function to parse ingredients
  const parseIngredients = (ingredientsString) => {
    if (!ingredientsString) return [];
    return ingredientsString.split('|').map(item => item.trim());
  };

  // Function to parse instructions
  const parseInstructions = (instructionsString) => {
    if (!instructionsString) return [];
    return instructionsString.split('.').filter(instruction => 
      instruction.trim().length > 0
    ).map(instruction => instruction.trim());
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mb-4"
      />

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="p-6">
            <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{recipe.title}</h3>
            
            {recipe.servings && (
              <p className="text-md text-muted-foreground mb-6">{recipe.servings}</p>
            )}

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Ingredients</h3>
                <ul className="space-y-2">
                  {parseIngredients(recipe.ingredients).map((ingredient, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                  {parseInstructions(recipe.instructions).map((instruction, i) => (
                    <li key={i} className="pl-2">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => handleFavorite(recipe.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Favorite ({recipe.favoriteCount})
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
