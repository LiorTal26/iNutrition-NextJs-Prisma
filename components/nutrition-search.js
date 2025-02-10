"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export default function NutritionSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Please enter a food item",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call your Next.js API route instead of the external API directly
      const response = await fetch(`/api/nutrition?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch nutrition data');
      }

      setResults(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-background/50 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter a food item (e.g., 3lb carrots and a chicken sandwich)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </Card>

      {results?.items && results.items.length > 0 && (
        <Card className="p-6 bg-background/50 backdrop-blur-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Serving Size</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="text-right">Protein (g)</TableHead>
                <TableHead className="text-right">Carbs (g)</TableHead>
                <TableHead className="text-right">Fat (g)</TableHead>
                <TableHead className="text-right">Fiber (g)</TableHead>
                <TableHead className="text-right">Sugar (g)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.serving_size_g}g</TableCell>
                  <TableCell className="text-right">{item.calories?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell className="text-right">{item.protein_g?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell className="text-right">{item.carbohydrates_total_g?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell className="text-right">{item.fat_total_g?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell className="text-right">{item.fiber_g?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell className="text-right">{item.sugar_g?.toFixed(1) || '0.0'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {results && (!results.items || results.items.length === 0) && (
        <Card className="p-6 text-center text-muted-foreground bg-background/50 backdrop-blur-sm">
          No nutrition data found for &quot;{query}&quot;
        </Card>
      )}
    </div>
  );
}
