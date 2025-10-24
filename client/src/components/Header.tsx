import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoUrl from "@assets/9C49F293-828D-4E79-934A-9012AEAF827F_1761254425302.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="flex items-center" data-testid="link-home">
          <img src={logoUrl} alt="von AI" className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link 
            href="/" 
            className="text-sm font-medium text-foreground transition-colors hover:text-primary" 
            data-testid="link-nav-home"
          >
            Home
          </Link>
          <Link 
            href="/solutions" 
            className="text-sm font-medium text-foreground transition-colors hover:text-primary" 
            data-testid="link-nav-solutions"
          >
            Solutions
          </Link>
          <Link 
            href="/case-studies" 
            className="text-sm font-medium text-foreground transition-colors hover:text-primary" 
            data-testid="link-nav-case-studies"
          >
            Case Studies
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium text-foreground transition-colors hover:text-primary" 
            data-testid="link-nav-blog"
          >
            Blog
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium text-foreground transition-colors hover:text-primary" 
            data-testid="link-nav-contact"
          >
            Contact
          </Link>
          <Link href="/contact" data-testid="link-nav-cta">
            <Button variant="default" size="default">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-testid="button-mobile-menu-toggle"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-6 pb-6 pt-4">
            <Link 
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-home"
            >
              Home
            </Link>
            <Link 
              href="/solutions"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-solutions"
            >
              Solutions
            </Link>
            <Link 
              href="/case-studies"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-case-studies"
            >
              Case Studies
            </Link>
            <Link 
              href="/blog"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-blog"
            >
              Blog
            </Link>
            <Link 
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-contact"
            >
              Contact
            </Link>
            <div className="pt-4">
              <Link 
                href="/contact"
                onClick={() => setMobileMenuOpen(false)} 
                data-testid="link-mobile-cta"
              >
                <Button variant="default" size="default" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
