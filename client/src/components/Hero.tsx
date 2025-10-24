import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            AI-Powered Business Transformation
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Automate Your Business with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Transform sales, service, and operations with intelligent AI automation. 
            From lead generation to customer support, we build AI solutions that work 24/7.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <a data-testid="button-hero-primary-cta">
                <Button size="lg" variant="default" className="group">
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </Link>
            <Link href="/solutions">
              <a data-testid="button-hero-secondary-cta">
                <Button size="lg" variant="outline">
                  Explore Solutions
                </Button>
              </a>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by forward-thinking companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-xs font-semibold text-muted-foreground">ENTERPRISE AI</div>
              <div className="text-xs font-semibold text-muted-foreground">SALES AUTOMATION</div>
              <div className="text-xs font-semibold text-muted-foreground">CUSTOMER SUCCESS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
