# Design Guidelines for von AI Website

## Design Approach

**Selected Approach: Reference-Based (Tech/AI Industry Leaders)**

Drawing inspiration from Linear's precision, Stripe's minimalist sophistication, and Vercel's modern developer aesthetic. The design will emphasize clarity, cutting-edge technology feel, and conversion optimization as a lead magnet.

**Key Design Principles:**
1. Precision over decoration - every element serves a purpose
2. Technology-forward aesthetic that builds trust in AI expertise
3. Conversion-focused hierarchy that guides visitors to lead capture
4. Content breathing room that emphasizes quality over quantity

---

## Typography

**Font System:**
- **Primary (Headlines/Display):** Inter or DM Sans - 700/800 weight for impact
- **Secondary (Body/UI):** Inter or System UI - 400/500/600 weights
- **Monospace (Technical accents):** JetBrains Mono or Fira Code for code snippets/technical details

**Type Scale:**
- Hero Headline: 56-72px (desktop), 36-48px (mobile)
- Section Headlines: 40-48px (desktop), 28-36px (mobile)
- Subsection Titles: 24-32px
- Body Large: 18-20px (for value propositions)
- Body Standard: 16px
- Body Small: 14px
- Captions/Labels: 12-13px

**Hierarchy Rules:**
- Use font weight variation over size for subtle hierarchy
- Limit line length to 65-75 characters for readability
- Use tight letter-spacing (-0.02em) on large headlines for premium feel
- Increase line-height (1.6-1.7) for body text

---

## Layout System

**Spacing Primitives (Tailwind Units):**
Core spacing set: **2, 4, 6, 8, 12, 16, 20, 24, 32**

**Application:**
- Micro spacing (internal components): 2, 4, 6
- Component spacing: 8, 12, 16
- Section spacing: 20, 24, 32
- Large gaps: 32+ for dramatic separation

**Container Strategy:**
- Full-width hero sections with inner max-w-7xl
- Content sections: max-w-6xl
- Blog content: max-w-3xl for optimal reading
- Consistent horizontal padding: px-6 (mobile), px-8 (tablet), px-12 (desktop)

**Vertical Rhythm:**
- Section padding: py-16 (mobile), py-24 (tablet), py-32 (desktop)
- Component internal spacing: py-8 to py-12
- Consistent rhythm creates professional polish

---

## Component Library

### Navigation
**Header:** Sticky, minimal height (64-72px), glassmorphism effect on scroll
- Logo left, navigation center/right
- Primary CTA button (orange accent from logo)
- Mobile: Slide-out menu with blur backdrop

### Hero Section
**Full-width hero with large background image:**
- Image Description: Abstract AI/neural network visualization or modern tech workspace with subtle overlay gradient
- Headline + subheadline + dual CTAs (primary: "Get Started" / secondary: "View Solutions")
- Buttons with blurred backgrounds (backdrop-blur-md) when over images
- Trust indicators below CTAs: "Trusted by 50+ companies" with small logo strip
- Height: 85vh with content vertically centered

### Service Cards
**3-column grid (desktop), stacked (mobile):**
- Icon/illustration at top (48-56px)
- Service title (24px bold)
- 2-3 sentence description
- "Learn More" link with arrow
- Subtle border, hover lift effect
- Key services: Lead Generation AI, Support Chatbots, Operational Copilots, Onboarding Agents

### Lead Capture Forms
**Two-step progressive disclosure:**
- Step 1: Email only with compelling headline ("See AI in action")
- Step 2: Additional fields (name, company, specific needs dropdown)
- Inline validation, micro-interactions on submit
- Clear privacy/value statement

### Blog Components
**Blog listing (2-column grid):**
- Featured post hero (full-width) at top
- Standard posts: thumbnail image, title, excerpt (100-120 chars), read time, publication date
- Category tags as filters
- Pagination or infinite scroll

**Individual post layout:**
- Wide hero image (16:9 aspect ratio)
- Author byline with avatar
- Table of contents for long posts
- Newsletter signup embedded mid-article and at end
- Related posts section

### Newsletter Signup
**Embedded blocks throughout site:**
- Compelling headline: "AI Automation Insights Weekly"
- Single email input + subscribe button
- Benefit bullets (3-4 items): industry trends, case studies, implementation guides
- Success state with confirmation message

### Footer
**Rich, informative footer:**
- 4-column layout: Company (about, team), Solutions (service links), Resources (blog, newsletter, case studies), Contact
- Newsletter signup integrated
- Social media links
- Copyright and legal links

### Testimonial/Social Proof
**Alternating layout:**
- Client logo grid (6-8 logos, subtle opacity)
- Individual testimonials: quote, headshot, name, title, company
- Metrics showcase: "X leads generated", "Y% response improvement", "Z hours saved"

---

## Page-Specific Layouts

### Homepage Flow:
1. Hero (full-width image with CTAs)
2. Trust bar (client logos)
3. Value proposition (3-column benefits)
4. Solutions showcase (4-6 detailed service cards)
5. How it works (3-step process visualization)
6. Social proof (testimonials + metrics)
7. Blog preview (latest 3 posts)
8. Final CTA section (lead capture form)

### Solutions Page:
- Brief hero (50vh) with category overview
- Detailed solution cards (alternating left/right layouts with illustrations)
- Each solution: problem statement, AI approach, key features, ROI metrics
- CTA at each solution: "Schedule Demo"

### Blog Index:
- Simple hero (30vh) with search functionality
- Featured post callout
- Category filter tabs
- 2-column grid of posts (6-9 visible)
- Newsletter signup between posts
- Pagination

### Individual Blog Post:
- Hero image (16:9, full-width)
- Narrow content column (max-w-3xl)
- Rich typography with clear hierarchy
- Code blocks with syntax highlighting (for technical content)
- Inline newsletter signup
- Author bio at end
- Related posts grid

---

## Interaction & Animation

**Minimal, purposeful animations:**
- Subtle parallax on hero image (0.3x scroll speed)
- Hover lifts on cards (translateY -4px)
- Fade-in on scroll for sections (intersection observer)
- Button hover: slight scale (1.02) + subtle glow
- Form inputs: border highlight on focus
- Page transitions: 200-300ms ease-out

**NO:**
- Excessive scroll-triggered animations
- Distracting particle effects
- Auto-playing videos/carousels

---

## Images

**Hero Section:** Large, impactful abstract technology/AI visualization (neural networks, data flows, or modern tech workspace) with subtle gradient overlay for text legibility

**Service Cards:** Custom iconography or small illustrations representing each AI solution type

**Blog Posts:** Featured images for each post (16:9 ratio), relevant to article topic

**About/Team:** Professional team photos or office environment shots

**Case Studies/Results:** Screenshots of AI agents in action, before/after comparisons, dashboard visualizations

All images should maintain consistent treatment: professional, high-quality, with subtle overlays when text is placed on top.

---

## Accessibility

- Maintain 4.5:1 contrast ratios minimum
- Focus states clearly visible on all interactive elements
- Semantic HTML throughout
- ARIA labels on icon-only buttons
- Keyboard navigation fully functional
- Alt text on all images

---

This design creates a premium, trustworthy AI automation agency presence that converts visitors through strategic content hierarchy, compelling CTAs, and a modern aesthetic that demonstrates technological expertise.