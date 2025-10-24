import { Bot, MessageSquare, Cpu, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: Bot,
    title: "Lead Generation & Qualification",
    description: "AI agents that identify, engage, and qualify leads automatically. Nurture prospects with personalized conversations that convert.",
    features: ["Automated lead scoring", "24/7 engagement", "Smart qualification"],
  },
  {
    icon: MessageSquare,
    title: "Customer Support AI Chatbots",
    description: "Intelligent chatbots that handle customer inquiries, manage cases, and escalate complex issues seamlessly.",
    features: ["Instant response times", "Case management", "Multi-channel support"],
  },
  {
    icon: Cpu,
    title: "Operational AI Copilots",
    description: "AI assistants that streamline workflows, automate repetitive tasks, and augment your team's capabilities.",
    features: ["Process automation", "Data analysis", "Workflow optimization"],
  },
  {
    icon: Users,
    title: "Onboarding AI Agents",
    description: "Automated onboarding experiences that guide new customers and employees through every step with personalized support.",
    features: ["Personalized journeys", "Progress tracking", "Adaptive learning"],
  },
];

export default function Services() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            AI Automation Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            Purpose-built AI agents that transform how you work across sales, service, and operations
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border bg-card hover-elevate transition-all duration-300"
              data-testid={`card-service-${index}`}
            >
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {service.title}
                </h3>
                
                <p className="mb-6 text-muted-foreground">
                  {service.description}
                </p>

                <ul className="mb-6 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <a data-testid={`link-service-learn-more-${index}`}>
                    <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </a>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
