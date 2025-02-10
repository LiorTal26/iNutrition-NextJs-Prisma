
"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Heart, ChevronLeft, ChevronRight } from "lucide-react";

export default function RecipesPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recipesPerPage = 4;
  const { toast } = useToast();

  // Function to fetch recipes from API
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recipe?query=${encodeURIComponent(query.trim())}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText || response.statusText}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        toast({
          title: "No results",
          description: `No recipe match for: "${query}".`,
          variant: "warning",
        });
      }

      setRecipes(data);
      setTotalPages(Math.ceil(data.length / recipesPerPage));
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipe to search",
        variant: "destructive",
      });
      return;
    }
    fetchRecipes();
  };

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Function to handle adding a recipe to favorites
  const handleFavorite = async (recipe) => {
    try {
      const response = await fetch("/api/recipe/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: recipe.id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update favorite count: ${errorData.error}`);
      }
  
      const updatedRecipe = await response.json();
      
      // Update recipes state
      setRecipes((prevRecipes) =>
        prevRecipes.map((r) =>
          r.id === recipe.id
            ? { ...r, favoriteCount: updatedRecipe.favoriteCount }
            : r
        )
      );
      
      // Save to localStorage
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isAlreadyFavorite = storedFavorites.some(fav => fav.id === recipe.id);
      
      if (!isAlreadyFavorite) {
        const newFavorites = [...storedFavorites, recipe];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        
        toast({
          title: "Success",
          description: "Recipe added to favorites!",
          variant: "success",
        });
      } else {
        toast({
          title: "Info",
          description: "Recipe is already in favorites!",
          variant: "info",
        });
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Recipe Search</h1>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipe-search" className="block text-sm font-medium">
                  Search for recipes
                </label>
                <Input
                  id="recipe-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a recipe name (e.g., chicken pasta)"
                  className="mb-4"
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    "Searching..."
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Recipes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Display fetched recipes with pagination */}
          {recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.slice((page - 1) * recipesPerPage, page * recipesPerPage).map((recipe) => (
                <Card key={recipe.id} className="p-6 shadow-lg">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="rounded-lg w-full h-48 object-cover mb-4"
                  />
                  <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Prep Time:</strong> {recipe.prepTime} min | <strong>Cook Time:</strong> {recipe.cookTime} min
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Ingredients:</strong> {recipe.ingredients}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    <strong>Instructions:</strong> {recipe.instructions.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <Button onClick={() => alert(recipe.instructions)} className="mt-2">
                      View Full Instructions
                    </Button>
                    <Button
                      onClick={() => handleFavorite(recipe)}
                      className="mt-2 flex items-center gap-2"
                    >
                      <Heart className="h-5 w-5 text-red-500" />
                      {recipe.favoriteCount}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {recipes.length > 0 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-5 w-5" /> Previous
              </Button>
              <span>Page {page} of {totalPages}</span>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Show message when no results found */}
          {recipes.length === 0 && !loading && query.trim() && (
            <Card className="p-6 text-center text-muted-foreground">
              &quot;{query}&quot;
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}