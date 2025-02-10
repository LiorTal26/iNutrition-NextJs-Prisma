"use client";

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">About NutriGuide</h3>
            <p className="text-sm text-muted-foreground">
              Your personal nutrition assistant helping you make informed decisions about your diet and health.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/nutrition" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nutrition Search</a></li>
              <li><a href="/image" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Image Analysis</a></li>
              <li><a href="/recipes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recipe Search</a></li>
              <li><a href="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Favorites</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Powered By</h3>
            <p className="text-sm text-muted-foreground">
              CalorieNinjas API
            </p>
            <p className="text-sm text-muted-foreground">
              Prisma SQL
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NutriGuide. All rights reserved by Neely and Lior.
        </div>
      </div>
    </footer>
  );
}