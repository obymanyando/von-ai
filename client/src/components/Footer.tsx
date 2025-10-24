import { Link } from "wouter";
import logoUrl from "@assets/9C49F293-828D-4E79-934A-9012AEAF827F_1761254425302.png";
import { Mail, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/">
              <a className="inline-block" data-testid="link-footer-logo">
                <img src={logoUrl} alt="von AI" className="h-8 w-auto" />
              </a>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              AI automation solutions that transform how businesses operate across sales, service, and operations.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="mailto:contact@von-ai.com"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Email"
                data-testid="link-footer-email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
                data-testid="link-footer-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Twitter"
                data-testid="link-footer-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/solutions">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-lead-gen">
                    Lead Generation AI
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/solutions">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-chatbots">
                    Customer Support Chatbots
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/solutions">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-copilots">
                    Operational Copilots
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/solutions">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-onboarding">
                    Onboarding Agents
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-blog">
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-newsletter">
                    Newsletter
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-case-studies">
                    Case Studies
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-about">
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-contact">
                    Contact
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-footer-terms">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} von AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
