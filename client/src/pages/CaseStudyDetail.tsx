import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { CaseStudy } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Clock, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";

export default function CaseStudyDetail() {
  const [, params] = useRoute("/case-studies/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;

  const { data: caseStudy, isLoading, error } = useQuery<CaseStudy>({
    queryKey: ["/api/case-studies", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-muted-foreground">Loading case study...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold">Case Study Not Found</h1>
          <Link href="/case-studies">
            <a>
              <Button>Back to Case Studies</Button>
            </a>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/case-studies">
            <a>
              <Button variant="ghost" className="mb-8" data-testid="button-back">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Case Studies
              </Button>
            </a>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex gap-2">
              <Badge variant="secondary">{caseStudy.industry}</Badge>
              <Badge variant="outline">{caseStudy.solutionType}</Badge>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
              {caseStudy.title}
            </h1>
            <p className="text-xl text-muted-foreground">{caseStudy.company}</p>
          </div>

          {/* Featured Image */}
          {caseStudy.featuredImageUrl && (
            <img
              src={caseStudy.featuredImageUrl}
              alt={caseStudy.title}
              className="mb-12 w-full rounded-lg object-cover"
              style={{ maxHeight: "500px" }}
            />
          )}

          {/* Key Metrics */}
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudy.costSavingsPercent && (
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{caseStudy.costSavingsPercent}%</div>
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                </CardContent>
              </Card>
            )}
            {caseStudy.efficiencyGainPercent && (
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{caseStudy.efficiencyGainPercent}%</div>
                  <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                </CardContent>
              </Card>
            )}
            {caseStudy.revenueImpactPercent && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{caseStudy.revenueImpactPercent}%</div>
                  <div className="text-sm text-muted-foreground">Revenue Impact</div>
                </CardContent>
              </Card>
            )}
            {caseStudy.timeToImplementation && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{caseStudy.timeToImplementation}</div>
                  <div className="text-sm text-muted-foreground">Implementation Time</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Problem */}
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">The Challenge</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{caseStudy.problem}</p>
              </CardContent>
            </Card>
          </div>

          {/* Solution */}
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Our Solution</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{caseStudy.solution}</p>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Results & Impact</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{caseStudy.results}</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Ready for Similar Results?</h3>
              <p className="mb-6 text-primary-foreground/90">
                Let's discuss how we can transform your business with AI automation
              </p>
              <Link href="/contact">
                <a>
                  <Button variant="secondary" size="lg" data-testid="button-cta-contact">
                    Schedule a Consultation
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
}
