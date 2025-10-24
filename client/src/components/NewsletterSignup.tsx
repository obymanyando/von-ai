import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle2 } from "lucide-react";
import type { InsertNewsletterSubscriber } from "@shared/schema";

interface NewsletterSignupProps {
  variant?: "inline" | "section";
}

export default function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (data: InsertNewsletterSubscriber) => {
      return await apiRequest("POST", "/api/newsletter/subscribe", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      setEmail("");
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our AI automation insights weekly.",
      });
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email });
  };

  if (variant === "section") {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-12">
            <div className="mx-auto max-w-2xl text-center">
              <Mail className="mx-auto mb-6 h-12 w-12 text-primary" />
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                AI Automation Insights Weekly
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Get the latest trends, case studies, and implementation guides delivered to your inbox
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={subscribeMutation.isPending || isSuccess}
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || isSuccess}
                  className="sm:w-auto"
                  data-testid="button-newsletter-subscribe"
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Subscribed
                    </>
                  ) : subscribeMutation.isPending ? (
                    "Subscribing..."
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>

              <ul className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
                <li className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Industry trends
                </li>
                <li className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Case studies
                </li>
                <li className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Implementation guides
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-2 text-lg font-semibold text-foreground">Subscribe to our newsletter</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Get weekly insights on AI automation
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={subscribeMutation.isPending || isSuccess}
          className="flex-1"
          data-testid="input-inline-newsletter-email"
        />
        <Button
          type="submit"
          disabled={subscribeMutation.isPending || isSuccess}
          size="default"
          data-testid="button-inline-newsletter-subscribe"
        >
          {isSuccess ? <CheckCircle2 className="h-4 w-4" /> : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
