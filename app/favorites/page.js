"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Pencil, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const { toast } = useToast();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Function to remove a favorite
  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    toast({
      title: "Removed",
      description: "Recipe removed from favorites.",
      variant: "destructive",
    });
  };

  // Function to start editing a recipe title
  const handleStartEdit = (recipe) => {
    setEditingId(recipe.id);
    setEditedTitle(recipe.title);
  };

  // Function to save edited title
  const handleSaveEdit = (id) => {
    if (!editedTitle.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const updatedFavorites = favorites.map((recipe) =>
      recipe.id === id ? { ...recipe, title: editedTitle.trim() } : recipe
    );
    
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setEditingId(null);
    setEditedTitle("");

    toast({
      title: "Updated",
      description: "Recipe title updated successfully.",
      variant: "success",
    });
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Favorite Recipes</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          {favorites.length > 0 ? (
            favorites.map((recipe) => (
              <Card key={recipe.id} className="p-6 shadow-lg">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="rounded-lg w-full h-48 object-cover mb-4"
                />
                {editingId === recipe.id ? (
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="flex-grow"
                      placeholder="Enter new title"
                    />
                    <Button
                      onClick={() => handleSaveEdit(recipe.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">{recipe.title}</h2>
                    <Button
                      onClick={() => handleStartEdit(recipe)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                <p className="text-gray-700 text-sm mb-4">
                  <strong>Prep Time:</strong> {recipe.prepTime} min |{" "}
                  <strong>Cook Time:</strong> {recipe.cookTime} min
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Ingredients:</strong> {recipe.ingredients}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  <strong>Instructions:</strong> {recipe.instructions.substring(0, 150)}...
                </p>
                <Button
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  className="mt-2 bg-red-500 flex items-center gap-2 hover:bg-red-600"
                >
                  <Trash className="h-5 w-5" /> Remove
                </Button>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              No favorite recipes yet. Add some from the recipes page.
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}