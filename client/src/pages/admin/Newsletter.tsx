import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { NewsletterSubscriber } from "@shared/schema";

export default function NewsletterComposer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const { data: subscribers } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/subscribers"],
  });

  const activeSubscribers = subscribers?.filter(s => s.status === "active") || [];

  const sendMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/newsletter/send", {
        subject,
        content,
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Newsletter sent successfully",
        description: `Sent to ${data.sent} subscribers`,
      });
      setSubject("");
      setContent("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send newsletter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and content",
        variant: "destructive",
      });
      return;
    }

    if (activeSubscribers.length === 0) {
      toast({
        title: "No subscribers",
        description: "You need active subscribers to send a newsletter",
        variant: "destructive",
      });
      return;
    }

    sendMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin/dashboard")}
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Send Newsletter</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            {activeSubscribers.length} active subscriber{activeSubscribers.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Composer */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compose Newsletter</CardTitle>
                <CardDescription>
                  Write your newsletter content and send it to all active subscribers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Your newsletter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    data-testid="input-newsletter-subject"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your newsletter content here (HTML supported)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    data-testid="textarea-newsletter-content"
                    className="mt-2 font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    HTML is supported. Use standard HTML tags to format your content.
                  </p>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={sendMutation.isPending}
                  className="w-full"
                  size="lg"
                  data-testid="button-send-newsletter"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sendMutation.isPending
                    ? "Sending..."
                    : `Send to ${activeSubscribers.length} Subscriber${activeSubscribers.length !== 1 ? "s" : ""}`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  This is how your newsletter will appear in subscribers' inboxes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border bg-muted/10 p-6">
                  {subject ? (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                      <p className="font-semibold text-foreground">{subject}</p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                      <p className="text-muted-foreground italic">No subject yet</p>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-2">von AI</h3>
                    </div>

                    {content ? (
                      <div
                        className="prose prose-sm max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">No content yet</p>
                    )}

                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        You're receiving this email because you subscribed to von AI updates.
                        <br />
                        <a href="#" className="underline">Unsubscribe</a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
