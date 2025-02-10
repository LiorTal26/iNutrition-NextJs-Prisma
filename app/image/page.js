"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Camera } from "lucide-react";

export default function ImageAnalysisPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // ✅ Calls Next.js API route instead of external API
      const response = await fetch('/api/image-nutrition', {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Image Analysis</h1>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="image-upload" className="block text-sm font-medium">
                  Upload a food image for nutrition analysis
                </label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  placeholder="Please upload your photo here"
                />
              </div>
              <Button type="submit" disabled={loading || !file} className="w-full">
                {loading ? (
                  "Analyzing..."
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Analyze Image
                  </>
                )}
              </Button>
            </form>
          </Card>

          {results?.items && results.items.length > 0 && (
            <Card className="p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Serving Size</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="text-right">Protein (g)</TableHead>
                    <TableHead className="text-right">Carbs (g)</TableHead>
                    <TableHead className="text-right">Fat (g)</TableHead>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {results && (!results.items || results.items.length === 0) && (
            <Card className="p-6 text-center text-muted-foreground">
              No nutrition data found in the image. Try uploading a different image.
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
