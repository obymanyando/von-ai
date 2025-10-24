import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { CaseStudy } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function CaseStudies() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedSolution, setSelectedSolution] = useState<string>("all");

  const { data: caseStudies, isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/case-studies"],
  });

  const industries = Array.from(new Set(caseStudies?.map(cs => cs.industry) || []));
  const solutionTypes = Array.from(new Set(caseStudies?.map(cs => cs.solutionType) || []));

  const filteredCaseStudies = caseStudies?.filter(cs => {
    const matchesIndustry = selectedIndustry === "all" || cs.industry === selectedIndustry;
    const matchesSolution = selectedSolution === "all" || cs.solutionType === selectedSolution;
    return matchesIndustry && matchesSolution;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Success Stories
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover how leading companies are transforming their operations with AI automation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Industry</label>
              <select
                className="rounded-md border border-input bg-background px-4 py-2 text-foreground hover-elevate"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                data-testid="filter-industry"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Solution Type</label>
              <select
                className="rounded-md border border-input bg-background px-4 py-2 text-foreground hover-elevate"
                value={selectedSolution}
                onChange={(e) => setSelectedSolution(e.target.value)}
                data-testid="filter-solution"
              >
                <option value="all">All Solutions</option>
                {solutionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Case Studies Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading case studies...</p>
            </div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No case studies found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredCaseStudies.map((caseStudy) => (
                <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`}>
                  <a data-testid={`case-study-${caseStudy.slug}`}>
                    <Card className="h-full hover-elevate">
                      {caseStudy.featuredImageUrl && (
                        <img
                          src={caseStudy.featuredImageUrl}
                          alt={caseStudy.title}
                          className="h-48 w-full object-cover rounded-t-md"
                        />
                      )}
                      <CardContent className="p-6">
                        <div className="mb-4 flex gap-2">
                          <Badge variant="secondary">{caseStudy.industry}</Badge>
                          <Badge variant="outline">{caseStudy.solutionType}</Badge>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground line-clamp-2">
                          {caseStudy.title}
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">{caseStudy.company}</p>
                        
                        {/* Metrics Preview */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                          {caseStudy.costSavingsPercent && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold text-foreground">
                                {caseStudy.costSavingsPercent}% cost savings
                              </span>
                            </div>
                          )}
                          {caseStudy.efficiencyGainPercent && (
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold text-foreground">
                                {caseStudy.efficiencyGainPercent}% efficiency
                              </span>
                            </div>
                          )}
                        </div>

                        <Button variant="ghost" className="group">
                          Read Case Study
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
