"use client";

import NutritionSearch from "@/components/nutrition-search";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NutritionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Nutrition Search</h1>
        <div className="max-w-2xl mx-auto">
          <NutritionSearch />
        </div>
      </main>
      <Footer />
    </div>
  );
}