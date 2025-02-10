"use client";

import { Button } from "@/components/ui/button";
import { Salad, Search, Camera, Book, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Nutrition Search",
      description: "Search for detailed nutrition information about any food item.",
      href: "/nutrition"
    },
    {
      icon: <Camera className="h-6 w-6 text-primary" />,
      title: "Image Analysis",
      description: "Get nutrition details from food images.",
      href: "/image"
    },
    {
      icon: <Book className="h-6 w-6 text-primary" />,
      title: "Recipe Search",
      description: "Discover delicious recipes and their nutritional content.",
      href: "/recipes"
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Favorites",
      description: "Save and manage your favorite foods and recipes.",
      href: "/favorites"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="hero-gradient">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Salad className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                Your Personal Nutrition Guide
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover the nutritional content of your favorite foods, analyze images,
                find recipes, and track your dietary preferences all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/nutrition">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/recipes">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    Browse Recipes
                    <Book className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="feature-card">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="p-2 bg-primary/10 w-fit rounded-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">
                    {feature.description}
                  </p>
                  <div className="flex items-center mt-4 text-primary font-medium">
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}