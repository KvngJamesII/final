# WhatsApp Registration Tool - Design Guidelines

## Design Approach

**System Selection**: Material Design-inspired clean interface optimized for form interactions and status feedback
**Reference**: WhatsApp's own minimal, green-accented aesthetic with clear progress states
**Principle**: Focused, distraction-free registration experience with immediate visual feedback

## Typography System

**Font Family**: Inter (via Google Fonts CDN)
- Headings: Inter Semi-Bold (600)
- Body/Labels: Inter Regular (400)
- Input Text: Inter Regular (400)
- Micro-copy/Status: Inter Medium (500)

**Size Scale**:
- Page Title: text-3xl (30px)
- Step Title: text-2xl (24px)
- Input Labels: text-sm (14px)
- Button Text: text-base (16px)
- Helper Text: text-xs (12px)

## Layout System

**Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12
- Component padding: p-6 or p-8
- Section gaps: gap-6
- Button padding: px-8 py-3
- Card margins: m-4

**Viewport Structure**:
- Centered card layout (max-w-md) with min-h-screen flex centering
- Fixed-width registration card (448px) floating on subtle background
- Mobile: Full-width with px-4 padding

## Core Components

### Registration Card Container
- White background with rounded-2xl corners
- Soft shadow (shadow-xl)
- Padding: p-8
- Top accent: 4px green border-t-4

### Progress Indicator
- 4-step horizontal stepper at card top
- Circles with connecting lines
- States: completed (green fill), active (green ring), pending (gray outline)
- Step labels below circles (text-xs)

### Phone Input Step
- Country code dropdown + phone number input side-by-side
- Flag icon in dropdown
- Single-line layout with border-2 inputs
- Focus state: green ring-2
- Helper text below: "We'll send you a verification code"

### OTP Input Step
- 6-digit OTP displayed as individual boxes (grid-cols-6)
- Large centered inputs (text-2xl, w-12 h-14)
- Auto-focus progression
- Resend code link below (text-sm, green underline)
- Timer countdown: "Resend in 0:45"

### Status Indicators
- Success: Green checkmark icon with "Verified!" text
- Error: Red alert icon with error message
- Loading: Spinner with "Sending code..." text
- All states use icon + text combination

### Buttons
**Primary CTA** (Continue/Verify):
- Full width (w-full)
- Green background (#25D366 - WhatsApp green)
- White text, rounded-lg
- Height: h-12
- Disabled state: opacity-50, cursor-not-allowed

**Secondary** (Back/Edit):
- Ghost style with green text
- Border-2 green outline
- Same sizing as primary

### Success Page
- Large centered checkmark animation placeholder
- Success message (text-2xl)
- Welcome text (text-gray-600)
- "Continue to Dashboard" button
- Confetti or particle effect placeholder comment

## Visual Hierarchy

**Information Architecture**:
1. Progress indicator (always visible top)
2. Step title with icon
3. Primary content (form/status)
4. Helper text/secondary actions
5. Primary CTA button

**Contrast Strategy**:
- Green accent (#25D366) for active states and CTAs only
- Gray scale for inactive elements (#E5E7EB, #9CA3AF, #374151)
- White backgrounds with strategic shadows
- High contrast for input text (#111827)

## Interaction Patterns

**Form Validation**:
- Real-time for phone format
- Shake animation on OTP error
- Success checkmark appears in input on valid
- Error messages slide in below inputs

**State Transitions**:
- Fade between steps (300ms)
- Button loading spinner replaces text
- Progress indicator fills sequentially

**Responsive Behavior**:
- Desktop: Centered card on gradient background
- Mobile: Full-screen card with minimal padding
- OTP inputs reduce to w-10 h-12 on small screens

## Images

**Background Pattern**: Subtle diagonal gradient from light gray to white (no hero image needed)
**Icons**: Material Icons CDN for phone, check, error, loading spinner
**Logo Placement**: Small WhatsApp icon (24px) top-left of card with "Registration" text

---

**Key Differentiators**: Ultra-focused single-task UI, prominent progress feedback, generous whitespace, strategic use of WhatsApp green only for actionable elements, mobile-first form optimization.