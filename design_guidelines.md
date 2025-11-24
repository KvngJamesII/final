# OTP King - Design Guidelines

## Design Approach

**Selected Approach**: Design System (Material Design 3) with modern dashboard aesthetics inspired by Linear and Vercel for clean, data-focused interfaces.

**Justification**: This is a utility-focused platform with information-dense displays (statistics, user management, SMS logs). Consistency and clarity are paramount while maintaining modern visual appeal.

**Key Principles**:
- Data clarity over decoration
- Scannable information hierarchy
- Efficient workflows with minimal friction
- Professional dashboard aesthetics

## Typography

**Font Families**:
- Primary: Inter (via Google Fonts) - all UI text, buttons, labels
- Monospace: JetBrains Mono - numbers, API tokens, SMS content

**Type Scale**:
- Page Headers: text-3xl md:text-4xl font-bold
- Section Titles: text-2xl font-semibold
- Card Headers: text-lg font-semibold
- Body Text: text-base font-normal
- Captions/Meta: text-sm font-medium
- Small Labels: text-xs font-medium uppercase tracking-wide

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4, p-6, p-8
- Section gaps: gap-4, gap-6, gap-8
- Margins: m-4, m-6, m-8, m-12

**Grid System**:
- Container: max-w-7xl mx-auto px-4 md:px-6
- Dashboard: Two-column (sidebar + main content)
- Cards Grid: grid-cols-1 md:grid-cols-2 gap-6

## Core Components

### Navigation Header (All Pages)
- Fixed top bar: h-16, sticky positioning
- Three-section layout: left (profile icon + notifications), center (OTP King logo), right (credit badge)
- Notification bell with red badge indicator (absolute positioning)
- Credit badge: rounded-full px-4 py-2, monospace font

### Country Hover Cards (Homepage)
- Card size: aspect-square or aspect-[4/3]
- Background: Blurred flag image overlay with gradient
- Content stack: Country name (text-2xl font-bold), country code (text-sm), number count (text-base)
- Grid: 2 per row desktop, 1 per row mobile
- Hover state: transform scale-105 transition-transform

### Admin Sidebar Navigation
- Fixed left sidebar: w-64 on desktop, collapsible on mobile
- Tab items: px-4 py-3, with icon + label
- Active state: distinct background treatment
- Sections: Statistics, Numbers, API, Users, Notifications, Announcements

### Data Tables (User Management, Number Lists)
- Full-width tables with sticky headers
- Alternating row treatment for readability
- Action buttons: icon-only, right-aligned per row
- Pagination: bottom-aligned, showing records count

### Statistics Dashboard
- Card-based layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Stat cards: p-6, with large number (text-3xl font-bold), label (text-sm), optional trend indicator
- Charts: Full-width chart containers with consistent height (h-64 or h-80)
- Maintenance toggle: Prominent switch component with label

### SMS Display Tab
- Message list: space-y-4
- Each message: p-4 rounded-lg border
- Structure: Sender (font-semibold), Message (font-normal), Date (text-sm text-muted)
- Check SMS button: Full-width, with loading spinner state

### Announcement Banner
- Scrolling marquee: h-12, positioned below header
- Text: text-sm font-medium, seamless loop animation
- Pausable on hover

### Forms (Login/Signup)
- Centered card layout: max-w-md mx-auto, p-8
- Input fields: Full-width, h-12, rounded-lg
- Labels: text-sm font-medium, mb-2
- Submit button: Full-width, h-12, font-semibold
- Referral input: Optional indicator with lighter treatment

### Modal/Dialog
- Overlay: Fixed inset with backdrop blur
- Content card: max-w-lg, p-6, rounded-xl
- Header: text-xl font-semibold, close button top-right
- Footer: Flex justify-end gap-4 for action buttons

## Page-Specific Layouts

### Homepage
- Header: Fixed top (h-16)
- Announcement banner: h-12 below header
- Search/Filter bar: max-w-2xl mx-auto, mb-8, with dropdown filters
- Country cards: grid grid-cols-1 md:grid-cols-2 gap-6, py-8

### Country Page
- Back button: Top-left, px-4 py-2, with arrow icon
- History button: Top-right, px-4 py-2
- Number display: text-center, text-4xl md:text-5xl font-mono font-bold, my-12
- Next button: Center-aligned, w-48, h-12
- SMS tab: mt-12, max-w-3xl mx-auto

### Admin Panel
- Sidebar: Fixed left, w-64, full-height
- Main content: ml-64 (desktop), p-8
- Tab content: Animated transitions between sections
- Upload forms: Drag-and-drop zones with file input

### Profile Page
- Card-based layout: max-w-2xl mx-auto
- Avatar section: Center-aligned, mb-8
- Info grid: grid-cols-1 md:grid-cols-2 gap-4
- Referral code: Copyable input with copy button

### History Page
- List view: space-y-4
- Each entry: flex justify-between items-center, p-4, clickable
- Entry details: Country flag icon, number (monospace), date used

## Interactive States

**Buttons**:
- Default: rounded-lg px-6 py-3
- Hover: Subtle scale or brightness shift
- Active: Slightly darker treatment
- Disabled: Reduced opacity, cursor-not-allowed

**Cards**:
- Resting: border, rounded-xl
- Hover: Shadow elevation increase
- Active/Selected: Border emphasis

**Loading States**:
- Spinner: Center-aligned, animated rotation
- Skeleton loaders: For data tables and card grids during fetch

## Accessibility

- Focus indicators: 2px outline offset on all interactive elements
- ARIA labels on icon-only buttons
- Form error messages: text-sm below inputs
- Skip navigation link for keyboard users
- Minimum touch target: 44x44px on mobile

## Responsive Behavior

- Mobile: Single column, collapsible sidebar, stacked layouts
- Tablet: 2-column grids, persistent sidebar option
- Desktop: Full multi-column dashboards, fixed sidebars