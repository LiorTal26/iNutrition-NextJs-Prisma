"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Salad } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Salad className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">NutriGuide</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/nutrition" className="nav-link">Nutrition</Link>
            <Link href="/image" className="nav-link">Image Analysis</Link>
            <Link href="/recipes" className="nav-link">Recipes</Link>
            <Link href="/favorites" className="nav-link">
              <Button variant="outline" size="sm">Favorites</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}