import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { Bot, MessageSquare, Cpu, Users, ArrowRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const solutions = [
  {
    icon: Bot,
    title: "Lead Generation & Qualification",
    description:
      "AI agents that work 24/7 to identify, engage, and qualify leads with personalized conversations that convert prospects into opportunities.",
    problem:
      "Manual lead qualification is time-consuming and inconsistent, causing missed opportunities and wasted sales resources.",
    solution:
      "Our AI agents automatically engage every lead, ask qualifying questions, score prospects, and route hot leads to your sales team instantly.",
    features: [
      "Automated lead scoring and prioritization",
      "24/7 engagement across all channels",
      "Smart qualification workflows",
      "Seamless CRM integration",
      "Real-time lead routing",
    ],
    metrics: [
      "60% increase in qualified leads",
      "3x faster response times",
      "45% reduction in cost per lead",
    ],
  },
  {
    icon: MessageSquare,
    title: "Customer Support AI Chatbots",
    description:
      "Intelligent chatbots that handle customer inquiries, manage support cases, and escalate complex issues seamlessly while maintaining a human touch.",
    problem:
      "Support teams are overwhelmed with repetitive questions, leading to long wait times and poor customer satisfaction.",
    solution:
      "Deploy AI chatbots that instantly resolve common inquiries, manage case workflows, and seamlessly hand off to human agents when needed.",
    features: [
      "Instant response to common questions",
      "Automated case creation and tracking",
      "Multi-channel support (web, email, chat)",
      "Smart escalation to human agents",
      "Knowledge base integration",
    ],
    metrics: [
      "75% reduction in response time",
      "50% decrease in support costs",
      "90% customer satisfaction rate",
    ],
  },
  {
    icon: Cpu,
    title: "Operational AI Copilots",
    description:
      "AI assistants that streamline workflows, automate repetitive operational tasks, and augment your team's capabilities with intelligent automation.",
    problem:
      "Teams waste hours on manual data entry, report generation, and routine tasks that could be automated.",
    solution:
      "Implement AI copilots that work alongside your team, handling routine operations while providing intelligent insights and recommendations.",
    features: [
      "Automated workflow orchestration",
      "Intelligent data processing",
      "Real-time analytics and insights",
      "Process optimization suggestions",
      "Integration with existing tools",
    ],
    metrics: [
      "40% time saved on routine tasks",
      "85% accuracy improvement",
      "30% increase in productivity",
    ],
  },
  {
    icon: Users,
    title: "Onboarding AI Agents",
    description:
      "Automated onboarding experiences that guide new customers and employees through every step with personalized, adaptive support.",
    problem:
      "Manual onboarding is inconsistent, resource-intensive, and often leaves new users confused or frustrated.",
    solution:
      "Create intelligent onboarding journeys that adapt to each user's pace, answer questions instantly, and ensure successful adoption.",
    features: [
      "Personalized onboarding paths",
      "Progress tracking and reminders",
      "Interactive tutorials and guides",
      "Instant Q&A support",
      "Adaptive learning based on user behavior",
    ],
    metrics: [
      "50% faster time to value",
      "70% reduction in support tickets",
      "95% completion rate",
    ],
  },
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            AI Automation Solutions
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Transform every aspect of your business with purpose-built AI agents
            that work seamlessly across sales, service, and operations
          </p>
        </div>
      </section>

      {/* Solutions Detail */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="space-y-24">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <Card className="border-border bg-card p-8">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <solution.icon className="h-8 w-8" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground">
                      {solution.title}
                    </h2>
                    <p className="mb-6 text-lg text-muted-foreground">
                      {solution.description}
                    </p>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                          The Challenge
                        </h3>
                        <p className="text-muted-foreground">{solution.problem}</p>
                      </div>
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                          Our Solution
                        </h3>
                        <p className="text-muted-foreground">{solution.solution}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-xl font-semibold text-foreground">
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {solution.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-4 text-xl font-semibold text-foreground">
                        Expected Results
                      </h3>
                      <div className="space-y-3">
                        {solution.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-primary/20 bg-primary/5 p-4"
                          >
                            <p className="font-semibold text-foreground">{metric}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/contact">
                      <a data-testid={`link-solution-cta-${index}`}>
                        <Button size="lg" variant="default" className="group">
                          Schedule a Demo
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl">
            Ready to Transform Your Business?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Schedule a free consultation to discover how AI automation can drive
            results for your organization
          </p>
          <Link href="/contact">
            <a data-testid="link-solutions-bottom-cta">
              <Button size="lg" variant="default">
                Get Started Today
              </Button>
            </a>
          </Link>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
}
