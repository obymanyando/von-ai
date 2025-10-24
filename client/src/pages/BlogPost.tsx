import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";
import { Calendar, ArrowLeft, User } from "lucide-react";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", slug],
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {isLoading ? (
        <article className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <Skeleton className="mb-4 h-8 w-32" />
            <Skeleton className="mb-6 h-12 w-full" />
            <Skeleton className="mb-8 h-6 w-48" />
            <Skeleton className="mb-8 h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </article>
      ) : post ? (
        <>
          <article className="py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-6 lg:px-12">
              {/* Back Button */}
              <Link href="/blog">
                <a data-testid="link-back-to-blog">
                  <Button variant="ghost" className="mb-8 -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </a>
              </Link>

              {/* Article Header */}
              <header className="mb-8">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  {post.publishedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publishedDate}>
                        {new Date(post.publishedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  )}
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImageUrl && (
                <div className="mb-8 overflow-hidden rounded-lg">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
                data-testid="blog-post-content"
              />

              {/* Newsletter Signup */}
              <div className="mt-12 border-t border-border pt-12">
                <NewsletterSignup variant="inline" />
              </div>
            </div>
          </article>
        </>
      ) : (
        <div className="py-24 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">
            Post Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <a data-testid="link-back-to-blog-notfound">
              <Button variant="default">Back to Blog</Button>
            </a>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
