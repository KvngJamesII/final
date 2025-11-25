# OTP King - Design Guidelines

## Design Approach
**Reference-Based with Modern SaaS Aesthetics**
Drawing inspiration from Twilio's clarity and Stripe's restraint, but infused with vibrant gradient treatments reminiscent of modern fintech apps like Revolut. The design prioritizes mobile usability while showcasing the platform's technical capabilities through clean, confident interfaces.

## Typography
**Font Stack:** Inter (Google Fonts) for all text
- **Headings:** 700 weight, tight line-height (1.1-1.2)
  - Mobile: text-3xl to text-4xl
  - Desktop: text-5xl to text-6xl
- **Subheadings:** 600 weight
  - Mobile: text-xl
  - Desktop: text-2xl
- **Body:** 400 weight, comfortable line-height (1.6)
  - Mobile/Desktop: text-base
- **Captions/Labels:** 500 weight, text-sm, uppercase with tracking-wide for section labels

## Layout System
**Spacing Primitives:** Tailwind units 4, 6, 8, 12, 16, 24
- Mobile padding: px-4, py-12 to py-16
- Desktop padding: px-6, py-20 to py-32
- Component spacing: gap-4 (mobile), gap-6 to gap-8 (desktop)
- Container: max-w-7xl with mx-auto

## Core Components

### Hero Section
Large hero image (lifestyle/technology themed showing mobile SMS usage) with gradient overlay (cyan to purple, 60% opacity). Content overlays image with blurred-background buttons (backdrop-blur-xl with bg-white/10 dark:bg-black/10).

**Structure:**
- Full viewport height on mobile (min-h-screen)
- Centered content: headline, subtext, dual CTA buttons
- Trust indicator below CTAs: "10,000+ active users" with checkmark icon
- Floating number cards showing live stats (glassmorphic design)

### Navigation
**Mobile:** Compact header with logo left, hamburger right
**Desktop:** Horizontal nav with logo left, links center, auth buttons right
- Sticky positioning on scroll
- Backdrop blur with translucent background
- Height: h-16 (mobile), h-20 (desktop)

### Features Grid
**Mobile:** Single column, cards stack
**Desktop:** 3-column grid (grid-cols-1 md:grid-cols-3)
- Each card: Lucide icon (size 24), title, description
- Gradient border treatment on hover
- Padding: p-6 to p-8

### Pricing Cards
**Mobile:** Stacked vertical cards
**Desktop:** 3-column layout with center card elevated
- Popular plan: scale-105 transform, gradient border
- Each card: plan name, price (large typography), feature list with check icons, CTA button
- Padding: p-8

### How It Works Section
Numbered steps (1-2-3) in mobile-friendly accordion or desktop horizontal timeline
- Step numbers in gradient circles
- Lucide icons for each step
- Short description text

### SMS Number Showcase
Interactive demo area showing sample virtual numbers with country flags
- Grid of number cards with copy-to-clipboard action
- Real-time availability status indicators
- Mobile: 1 column, Desktop: 2-3 columns

### Testimonials
**Mobile:** Vertical stack
**Desktop:** 2-column grid
- User avatar (placeholder circular image), name, role
- Quote text with subtle background treatment
- Star ratings using Lucide star icons

### Footer
Multi-column layout collapsing to vertical on mobile
- Brand column: logo, tagline, social icons (Lucide)
- Quick links: Products, Company, Support, Legal
- Newsletter signup with inline form
- Trust badges row: secure payment, data privacy indicators

## Buttons & Forms
**Primary Button:**
- Gradient background (cyan to teal)
- White text, 600 weight
- Padding: px-6 py-3 (mobile), px-8 py-4 (desktop)
- Rounded-lg
- Lucide icon (optional trailing arrow-right)

**Secondary Button:**
- Transparent with gradient border
- Gradient text color
- Same padding/sizing as primary

**Forms:**
- Input fields: rounded-lg, p-4, border with focus ring
- Labels: text-sm, 500 weight, mb-2
- Floating labels for modern feel
- Inline validation with Lucide icons (check-circle, alert-circle)
- Country code selector with flags for phone inputs

## Gradient Applications
**Primary Gradient:** cyan-400 → teal-500 → purple-600
- Use on: buttons, section dividers, card borders, text highlights
**Background Gradients:**
- Light mode: subtle cyan/teal radial gradients at 5-10% opacity
- Dark mode: deeper purple/teal gradients at 15-20% opacity

## Images Section
**Hero Image:** Modern lifestyle shot of person using smartphone for authentication/SMS, vibrant lighting, professional photography style. Full-width, min-h-screen on mobile. Position: center-center, overlay with gradient (cyan to purple at 60% opacity).

**Feature Section Images:** Abstract technology/network visualizations showing global connectivity, SMS transmission illustrations (isometric style). Use as accent images alongside feature cards on desktop (not mobile).

**Dashboard Preview:** Screenshot mockup of the platform dashboard showing virtual numbers interface. Place in "See It In Action" section, mobile device frame on mobile viewport, browser frame on desktop.

## Mobile-First Specifics
- Touch targets minimum 44px height
- Bottom navigation consideration for key actions
- Swipeable card carousels for features
- Larger tap areas on interactive elements
- Simplified navigation with drawer menu
- Single column layouts default, expanding to multi-column at md breakpoint (768px)