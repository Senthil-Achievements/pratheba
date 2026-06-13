---
name: Cinematic Editorial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c2d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#998ca0'
  outline-variant: '#4d4354'
  surface-tint: '#dfb7ff'
  primary: '#dfb7ff'
  on-primary: '#4b007e'
  primary-container: '#ba6bff'
  on-primary-container: '#41006f'
  inverse-primary: '#891fd8'
  secondary: '#d1bcff'
  on-secondary: '#3d0090'
  secondary-container: '#5728af'
  on-secondary-container: '#c4abff'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#909191'
  on-tertiary-container: '#282a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f1daff'
  primary-fixed-dim: '#dfb7ff'
  on-primary-fixed: '#2d004f'
  on-primary-fixed-variant: '#6b00b0'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d1bcff'
  on-secondary-fixed: '#24005b'
  on-secondary-fixed-variant: '#5425ac'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.009em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.009em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.009em
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.20em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style
The design system is rooted in a "Dark Cinematic" aesthetic, blending the precision of a high-end architectural portfolio with the editorial sophistication of a luxury fashion journal. It targets professionals seeking to navigate the technical world of ATS systems with a tool that feels like a premium workspace rather than a utility.

The visual language is characterized by high contrast, immense negative space, and linear precision inspired by Vercel's structural minimalism. It evokes a sense of authority, technical prowess, and calm confidence through glassmorphic surfaces and subtle gradient washes that replace traditional elevation.

## Colors
The palette is centered on a "void" background (`#090909`), which serves as the canvas for high-chroma accents. 

- **Primary Accent (Iris):** Used for primary calls to action, scan progress indicators, and focal points.
- **Secondary Accent (Plum):** Used for depth, hover states on iris elements, and secondary categorization.
- **Neutral/Surface:** The background remains deep and ink-like. Text tiers rely on stark white (`#f7f9fa`) for readability and a desaturated grey (`#6b6b6b`) for non-essential metadata.
- **Glassmorphic Borders:** Borders are consistently semi-transparent white, creating a "frosted edge" effect against the dark background.

## Typography
Typography is the primary driver of hierarchy in this design system. We use a three-font strategy:
- **Playfair Display (Light Italic):** Reserved for large display headings and editorial moments. It provides a human, sophisticated touch against the technical backdrop.
- **Inter:** The workhorse for all interface elements, form fields, and body copy. It is tight, legible, and modern.
- **JetBrains Mono:** Used for technical metadata, "ATS-parsed" data chips, and labels. The wide tracking (+20%) is essential for the technical, architectural feel.

## Layout & Spacing
The layout follows a strict 12-column fluid grid on desktop with generous margins (`64px`) to emphasize the cinematic feel. 

- **Vertical Rhythm:** Based on an 8px scale.
- **Micro-spacing:** 4px units for tight component internal spacing.
- **Reflow:** On mobile, margins shrink to 16px and the grid collapses to 4 columns.
- **Alignment:** Elements should feel "hung" on a grid. Avoid centered layouts for technical data; use left-aligned, structured blocks to mimic the layout of a physical resume or architectural blueprint.

## Elevation & Depth
In this design system, depth is achieved through material property and light, not shadow.
- **Backdrop Blur:** All floating surfaces (modals, dropdowns, cards) must use a `20px` backdrop blur to suggest translucency.
- **Linear Borders:** A `1px` solid border (`rgba(255,255,255,0.12)`) defines the boundary of all surfaces.
- **Gradient Washes:** Instead of box-shadows, use subtle radial gradients (15% opacity iris/plum) positioned behind cards to create a "glow" that lifts the element from the `#090909` background.
- **Layering:** Level 0 is the background; Level 1 is the glass card; Level 2 is the pill-shaped button.

## Shapes
The shape language is a contrast between architectural rigidity and organic softness.
- **Pill Shapes:** Used for all interactive triggers (buttons, chips, toggles) to make them feel "touchable" and distinct from the layout.
- **Geometric Cards:** Cards use a specific `19.2px` radius, providing a modern, "squircle-adjacent" look that feels premium.
- **Lines:** Horizontal and vertical dividers should be `1px` and use the same transparency as borders to maintain the linear, Vercel-inspired look.

## Components
- **Buttons:** Primary buttons are pill-shaped with a solid Iris (`#af50ff`) fill and white text. Secondary buttons are glassmorphic with the standard 1px border.
- **Input Fields:** Bottom-border only or fully enclosed with 19.2px radius. Use JetBrains Mono for placeholder text to emphasize the "scanning" nature of the product.
- **Cards:** Glassmorphic with `backdrop-blur: 20px`. No shadows. Use a subtle top-left to bottom-right linear gradient (white at 5% to white at 2%) for the surface fill.
- **Chips:** Always JetBrains Mono, all-caps, with wide tracking. Used for ATS keywords (e.g., "MATCHED", "MISSING").
- **Lists:** Clean, horizontal rows separated by 1px muted borders. Hover states should trigger a subtle Plum (`#7f56d9`) background wash rather than a shadow.
- **Progress Bars:** Thin, 2px lines using a gradient from Plum to Iris, reflecting the "scan" progress.