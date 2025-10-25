import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requestPasswordResetSchema, type RequestPasswordReset } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import logoUrl from "@assets/9C49F293-828D-4E79-934A-9012AEAF827F_1761254425302.png";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<RequestPasswordReset>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      username: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: RequestPasswordReset) => {
      return await apiRequest("POST", "/api/admin/request-password-reset", data);
    },
    onSuccess: () => {
      toast({
        title: "Password reset requested",
        description: "If the username exists, a password reset email will be sent.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message || "Failed to request password reset",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestPasswordReset) => {
    resetMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logoUrl} alt="von AI" className="h-10" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your username and we'll send you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin"
                        {...field}
                        data-testid="input-forgot-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={resetMutation.isPending}
                data-testid="button-request-reset"
              >
                {resetMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link href="/admin/login">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-to-login">
                    Back to login
                  </a>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
