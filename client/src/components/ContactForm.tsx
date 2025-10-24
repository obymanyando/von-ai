import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertContactLeadSchema, type InsertContactLead } from "@shared/schema";
import { Send } from "lucide-react";

const services = [
  "Lead Generation & Qualification",
  "Customer Support AI Chatbots",
  "Operational AI Copilots",
  "Onboarding AI Agents",
  "Custom AI Solution",
];

export default function ContactForm() {
  const { toast } = useToast();

  const form = useForm<InsertContactLead & { subscribeToNewsletter?: boolean }>({
    resolver: zodResolver(insertContactLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
      serviceInterest: "",
      subscribeToNewsletter: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactLead & { subscribeToNewsletter?: boolean }) => {
      // If user wants to subscribe to newsletter, do that separately
      if (data.subscribeToNewsletter) {
        try {
          await apiRequest("POST", "/api/newsletter/subscribe", { email: data.email });
        } catch (error) {
          console.error("Newsletter subscription failed:", error);
        }
      }
      // Remove the newsletter flag before sending contact data
      const { subscribeToNewsletter, ...contactData } = data;
      return await apiRequest("POST", "/api/contact/submit", contactData);
    },
    onSuccess: (_, variables) => {
      const subscribed = variables.subscribeToNewsletter;
      toast({
        title: "Message sent successfully!",
        description: subscribed 
          ? "We'll get back to you within 24 hours. You're now subscribed to our newsletter!"
          : "We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactLead & { subscribeToNewsletter?: boolean }) => {
    submitMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    data-testid="input-contact-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    {...field}
                    data-testid="input-contact-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Inc."
                    {...field}
                    data-testid="input-contact-company"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                    data-testid="input-contact-phone"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Interest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-contact-service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your automation needs..."
                  className="min-h-32 resize-none"
                  {...field}
                  data-testid="input-contact-message"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscribeToNewsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="checkbox-newsletter-subscription"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Subscribe to our newsletter
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Get the latest updates on AI automation trends and best practices
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={submitMutation.isPending}
          className="w-full sm:w-auto"
          data-testid="button-contact-submit"
        >
          {submitMutation.isPending ? (
            "Sending..."
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
