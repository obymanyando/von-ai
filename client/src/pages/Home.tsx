import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import { Testimonials, ClientLogos } from "@/components/Testimonials";
import { ROICalculator } from "@/components/ROICalculator";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import { CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Home() {
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const latestPosts = blogPosts?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Value Proposition Section */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose von AI
            </h2>
            <p className="text-lg text-muted-foreground">
              We don't just build AI—we deliver measurable business outcomes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  3x Faster Response
                </h3>
                <p className="text-muted-foreground">
                  Our AI agents respond instantly, reducing wait times from hours to seconds
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  40% Cost Reduction
                </h3>
                <p className="text-muted-foreground">
                  Automate repetitive tasks and free your team to focus on high-value work
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  24/7 Availability
                </h3>
                <p className="text-muted-foreground">
                  Your AI workforce never sleeps, ensuring round-the-clock service delivery
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Services />

      {/* Blog Preview Section */}
      {latestPosts.length > 0 && (
        <section className="border-t border-border py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
                  Latest Insights
                </h2>
                <p className="text-lg text-muted-foreground">
                  Expert perspectives on AI automation
                </p>
              </div>
              <Link href="/blog">
                <a data-testid="link-view-all-blog">
                  <Button variant="ghost" className="hidden sm:flex">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <a data-testid={`link-blog-post-${post.slug}`}>
                    <Card className="h-full hover-elevate transition-all duration-300">
                      {post.featuredImageUrl && (
                        <img
                          src={post.featuredImageUrl}
                          alt={post.title}
                          className="h-48 w-full object-cover rounded-t-lg"
                        />
                      )}
                      <CardContent className="p-6">
                        <p className="mb-2 text-xs text-muted-foreground">
                          {post.publishedDate
                            ? new Date(post.publishedDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                        <h3 className="mb-2 text-xl font-semibold text-foreground line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ClientLogos />
      <Testimonials />
      <ROICalculator variant="embedded" />
      <NewsletterSignup variant="section" />
      <Footer />
    </div>
  );
}
