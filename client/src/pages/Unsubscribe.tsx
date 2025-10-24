import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Unsubscribe() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("Email not provided");
      return await apiRequest("POST", "/api/newsletter/unsubscribe", { email });
    },
    onSuccess: () => {
      setIsUnsubscribed(true);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <Card>
            <CardHeader className="text-center">
              {isUnsubscribed ? (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Successfully Unsubscribed</CardTitle>
                  <CardDescription>
                    You've been removed from our newsletter list. We're sorry to see you go!
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Unsubscribe from Newsletter</CardTitle>
                  <CardDescription>
                    {email
                      ? `Are you sure you want to unsubscribe ${email} from our newsletter?`
                      : "No email address provided"}
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {isUnsubscribed ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    You won't receive any more newsletters from us. If you change your mind,
                    you can always resubscribe on our homepage.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setLocation("/")}
                      variant="default"
                      data-testid="button-go-home"
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </div>
              ) : email ? (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => unsubscribeMutation.mutate()}
                    disabled={unsubscribeMutation.isPending}
                    variant="destructive"
                    data-testid="button-confirm-unsubscribe"
                  >
                    {unsubscribeMutation.isPending ? "Unsubscribing..." : "Yes, Unsubscribe"}
                  </Button>
                  <Button
                    onClick={() => setLocation("/")}
                    variant="outline"
                    data-testid="button-cancel-unsubscribe"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Please use the unsubscribe link from your email.
                  </p>
                  <Button
                    onClick={() => setLocation("/")}
                    variant="default"
                    data-testid="button-back-home"
                  >
                    Back to Homepage
                  </Button>
                </div>
              )}

              {unsubscribeMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  {unsubscribeMutation.error instanceof Error
                    ? unsubscribeMutation.error.message
                    : "Failed to unsubscribe. Please try again."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
