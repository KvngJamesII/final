# OTP King - Design Guidelines

## Design Approach
**System**: Modern SaaS Dashboard Architecture inspired by Linear's precision + Stripe's professional restraint + Vercel's clean data presentation.

**Core Principles**: 
- Information density without clutter
- Scannable data hierarchies
- Professional credibility through restraint
- Clear action pathways

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - All UI, body text
- Monospace: JetBrains Mono - API keys, codes, technical data

**Hierarchy**:
- Hero/H1: text-5xl/6xl font-bold (landing hero only)
- H2 (Page titles): text-3xl font-semibold
- H3 (Section headers): text-xl font-semibold
- H4 (Card titles): text-lg font-medium
- Body: text-base
- Small/Meta: text-sm text-gray-600
- Micro (timestamps): text-xs text-gray-500

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6
- Section spacing: py-12 or py-16
- Card gaps: gap-6 or gap-8
- Form fields: space-y-4

**Grid Patterns**:
- Stats/Metrics: 3-4 columns (grid-cols-3 lg:grid-cols-4)
- Feature cards: 3 columns (grid-cols-1 md:grid-cols-3)
- Admin tables: Full-width single column with horizontal scroll
- Dashboard widgets: 2 columns (grid-cols-1 lg:grid-cols-2)

**Container Widths**:
- Marketing pages: max-w-7xl
- Dashboards: max-w-screen-2xl (wider for data)
- Forms: max-w-2xl

---

## Component Library

### Navigation
**Public Header**: Sticky top navigation with logo left, nav center (Features, Pricing, Docs, API), CTA button right (Get Started). Background blur on scroll.

**Dashboard Sidebar**: Fixed left sidebar (w-64) with logo, user avatar/credits at top, navigation links (Dashboard, API Keys, Usage, Billing, Documentation), admin section at bottom (if admin: Notifications, Users, Analytics, Settings). Active state with subtle blue accent.

### Data Display Components

**Stat Cards**: White cards with shadow, icon in colored circle (blue/purple/green), large number (text-3xl font-bold), label below (text-sm text-gray-600), trend indicator if applicable (+12% with up arrow).

**Usage Charts**: Line/bar charts showing SMS usage over time, verification success rates. Use Chart.js or Recharts patterns.

**Tables**: 
- Header row with text-sm font-medium uppercase text-gray-500
- Rows with hover:bg-gray-50 transition
- Monospace font for API keys, codes, timestamps
- Action buttons right-aligned (icon buttons)
- Pagination at bottom

**Credit Display**: Prominent card showing current credits (large number), usage this month, "Add Credits" button. Visual progress bar showing consumption rate.

### Forms & Inputs

**Input Fields**: 
- Labels: text-sm font-medium mb-2
- Inputs: Rounded borders (rounded-lg), focus:ring-2 ring-blue-500
- Helper text: text-xs text-gray-500 mt-1
- Error states: Red border + error message below

**Buttons**:
- Primary: Blue background, white text, rounded-lg px-6 py-3
- Secondary: Purple outline, purple text
- Success: Green background
- Danger: Red background
- Icon-only: Circular, subtle hover state

### Admin Panel Specific

**Notification Bell**: Icon with badge count in header, dropdown panel showing recent admin notifications (new user signups, API usage alerts, payment events).

**User Management Table**: Columns: Avatar, Name, Email, Credits, Status (active/inactive badge), Join Date, Actions (View, Edit, Suspend).

**Analytics Dashboard**: Multiple stat cards row, large usage graph, top users table, geographic distribution map placeholder.

---

## Page-Specific Layouts

### Landing Page
**Hero Section** (100vh): Full-width background image (abstract tech/network visualization with blue-purple gradient overlay). Centered content with main headline (text-6xl font-bold), subheadline (text-xl text-gray-300 max-w-2xl), two CTA buttons side-by-side (Start Free Trial + View Documentation). Floating stat badges in corners (99.9% Uptime, 10M+ SMS Sent).

**Features Grid**: 3-column cards (SMS Verification, API Integration, Real-time Analytics, Global Coverage, Advanced Security, Developer Tools). Each with icon, title, description.

**How It Works**: 3-step horizontal timeline with numbered circles connected by lines. Visual representation of: Sign Up → Integrate API → Send Verifications.

**Pricing**: 3-column tier cards (Starter, Professional, Enterprise) with feature lists and credit packages.

**Trust Section**: 2-column split - left: large stats (uptime, messages, developers), right: testimonial quotes with company logos.

**CTA Footer Band**: Dark background with centered "Ready to get started?" + CTA button.

### User Dashboard
**Top Stats Row**: 4 cards showing Available Credits, SMS Sent (this month), Success Rate, Active API Keys.

**Main Content Area**: 2-column grid
- Left: Usage chart (7-day SMS activity), Recent verifications table
- Right: Quick actions card (Generate API Key, Add Credits, View Docs), API endpoint reference

### Admin Panel
**Overview Dashboard**: 
- Top: 4 metric cards (Total Users, Active API Keys, SMS Today, Revenue This Month)
- Middle: Large combined chart (Users vs SMS volume over time)
- Bottom: 2-column - Recent signups table + Top spenders table

**Users Management**: Full-width table with filters (Status, Date range), search bar, export button.

**Notifications Center**: Timeline view of all system events with timestamps, filterable by type, mark as read functionality.

---

## Images

**Hero Image**: Abstract visualization showing interconnected nodes/network with flowing data particles. Blue-purple gradient overlay (opacity-80). Modern, tech-forward aesthetic suggesting connectivity and reliability. Place as background-image with background-size: cover.

**Feature Section Icons**: Use Heroicons (via CDN) - shield-check, code-bracket, chart-bar, globe-alt, lock-closed, terminal icons for respective features.

**Dashboard Illustrations**: No decorative images. Focus on data visualization and functional UI elements.

**Blur Treatment**: All buttons placed on hero image background use backdrop-blur-sm with semi-transparent background (bg-white/20 or bg-blue-600/80).

---

## Accessibility & Polish
- All interactive elements have clear hover states
- Form inputs show focus rings
- Tables maintain consistent alignment
- Icons always paired with labels or tooltips
- Loading states for async operations (skeleton screens)
- Empty states with helpful messaging and actions
- Consistent 8px border-radius throughout (rounded-lg)