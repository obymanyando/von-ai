import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export function Testimonials() {
  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about transforming their operations with AI automation
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover-elevate" data-testid={`testimonial-${testimonial.id}`}>
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatarUrl || undefined} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClientLogos() {
  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const clientLogos = testimonials
    ?.filter(t => t.companyLogoUrl)
    .map(t => ({
      name: t.company,
      logoUrl: t.companyLogoUrl!,
    })) || [];

  if (clientLogos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-8">
          Trusted by leading companies
        </h3>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center justify-items-center">
          {clientLogos.map((logo) => (
            <img
              key={logo.name}
              src={logo.logoUrl}
              alt={logo.name}
              className="h-12 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
              data-testid={`client-logo-${logo.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
