import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <a data-testid="link-home-404">
              <Button size="lg" variant="default">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </a>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
