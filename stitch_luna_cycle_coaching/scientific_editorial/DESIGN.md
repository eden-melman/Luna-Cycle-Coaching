---
name: Scientific Editorial
colors:
  surface: '#fdf9f6'
  surface-dim: '#ddd9d6'
  surface-bright: '#fdf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f0'
  surface-container: '#f1edea'
  surface-container-high: '#ebe7e5'
  surface-container-highest: '#e5e2df'
  on-surface: '#1c1b1a'
  on-surface-variant: '#4e444b'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f4f0ed'
  outline: '#80747b'
  outline-variant: '#d1c3cb'
  surface-tint: '#7b5073'
  primary: '#32102f'
  on-primary: '#ffffff'
  primary-container: '#4a2545'
  on-primary-container: '#bc8bb1'
  inverse-primary: '#ebb7df'
  secondary: '#9d4400'
  on-secondary: '#ffffff'
  secondary-container: '#ff8841'
  on-secondary-container: '#692b00'
  tertiary: '#2f132c'
  on-tertiary: '#ffffff'
  tertiary-container: '#462842'
  on-tertiary-container: '#b68ead'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd7f4'
  primary-fixed-dim: '#ebb7df'
  on-primary-fixed: '#300e2d'
  on-primary-fixed-variant: '#61395b'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68f'
  on-secondary-fixed: '#331100'
  on-secondary-fixed-variant: '#773200'
  tertiary-fixed: '#ffd7f4'
  tertiary-fixed-dim: '#e5bada'
  on-tertiary-fixed: '#2d112a'
  on-tertiary-fixed-variant: '#5d3c57'
  background: '#fdf9f6'
  on-background: '#1c1b1a'
  surface-variant: '#e5e2df'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  stats-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1'
    letterSpacing: -0.03em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style

This design system establishes a rigorous, sports-science aesthetic for women's cycling coaching. It departs from traditional wellness tropes in favor of an "Editorial Sports-Science" direction—blending the authority of a high-end broadsheet with the precision of a performance laboratory. The personality is intellectual, disciplined, and elite, yet remains approachable through warm, paper-like textures and human-centric documentary photography.

The visual style is **Minimalist with High-Contrast Typography**. It prioritizes extreme clarity, generous whitespace (white-space as "breathing room" for focus), and sharp, intentional linework. The UI should feel like a premium physical journal: tactile, permanent, and deeply researched.

## Colors

The palette is rooted in a "Deep Plum" and "Warm Paper" foundation, intentionally avoiding stereotypical gendered colors. 

- **Primary (Deep Plum):** Used for primary actions, heavy headings, and brand-defining structural elements. It conveys authority and depth.
- **Accent (Warm Amber):** Reserved for performance data, "active" states in training cycles, and critical calls to action. It provides a high-contrast spark against the plum and off-white.
- **Backgrounds:** The primary workspace is `#FBF7F4`, a warm off-white that reduces eye strain and mimics high-quality recycled paper. Use `#FFFFFF` for cards and floating surfaces to create subtle elevation.
- **Text:** The primary text color is a very dark plum (`#3A1D36`) rather than pure black, maintaining a sophisticated tonal relationship with the brand colors.

## Typography

The typography strategy relies on the tension between the sharp, high-contrast **Playfair Display** (mimicking the "knife-cut" feel of GT Sectra) and the utilitarian, neutral **Public Sans**.

- **Headlines:** Set in Playfair Display with tight tracking. Larger display sizes should use bold weights to emphasize the high-contrast serifs.
- **Body:** Set in Public Sans for a "government-grade" clarity. It provides a sober, scientific counterweight to the expressive headlines.
- **Stats:** For physiological data (power, heart rate, cadence), use Public Sans with light weights and tight tracking to mirror technical laboratory readouts.
- **Case Usage:** Use `label-caps` for eyebrows and small metadata to reinforce the editorial grid feel.

## Layout & Spacing

This design system utilizes an **Asymmetric Fluid Grid**. While based on a standard 12-column layout for desktop, content should be shifted intentionally—for example, using columns 1-8 for a narrative and 10-12 for technical sidebars or "Pull Quotes" of data.

- **Rhythm:** A 4px baseline grid ensures vertical alignment across disparate typographic styles.
- **Asymmetry:** Avoid perfect centering. Lean into left-aligned content with large, purposeful gaps on the right to simulate a premium magazine layout.
- **Breakpoints:** 
  - **Mobile (<768px):** Single column, 20px margins. Headlines scale down significantly.
  - **Tablet (768px - 1024px):** 8-column grid, 40px margins.
  - **Desktop (>1024px):** 12-column grid, 64px margins. Use "hanging" elements that bleed off the edge of the container to add visual interest.

## Elevation & Depth

To maintain the "Scientific Editorial" aesthetic, the system avoids heavy shadows and traditional material depth.

- **Tonal Layering:** Depth is communicated through color blocks rather than shadows. Use the primary background (`#FBF7F4`) as the base, and use white (`#FFFFFF`) for elevated cards. 
- **Low-Contrast Outlines:** Instead of shadows, use 1px borders in `#E4D7DF` to define interactive areas and sections.
- **Ghosting:** Use subtle shifts in opacity (e.g., 50% on secondary text) to create hierarchy.
- **Zero-Shadow Rule:** In general, do not use ambient shadows. If a shadow is strictly necessary for a floating modal, use a very tight, neutral plum tint with 0% blur to simulate a "hard edge" stacked paper effect.

## Shapes

The shape language is **Sharp (0px roundedness)**. 

- **Hard Edges:** All buttons, cards, and input fields must have 90-degree corners. This reinforces the "unrefined" brutalist edge and the precision of scientific charts.
- **The "Cycle Wheel" Motif:** The only exception to the sharp rule is the use of circular "Segmented Wheel" motifs for data visualization (e.g., menstrual cycle phase tracking or power distribution). These circles should be treated as geometric diagrams, often containing or surrounded by sharp-edged rectangular grids.
- **Linework:** Use consistently thin 1px lines for dividers and borders. For diagrams, use 1.5px lines for the primary subject and 0.5px for grid lines.

## Components

- **Buttons:** Sharp corners. Primary buttons are solid Deep Plum with On-Dark text. Secondary buttons use a 1px Plum border with transparent background. Interactive states for both use a subtle shift to the Warm Amber accent for the text or border.
- **Cards:** White background with a 1px border (`#E4D7DF`). No shadow. Headers inside cards should use `label-caps`.
- **Input Fields:** Bottom-border only (1px `#3A1D36`) to mimic a physical form or ledger. Labels remain visible above the line in `label-caps`.
- **Data Visualizations:** Use a "documentary" style. Lines should be Deep Plum or Warm Amber. No gradients.
- **Segmented Counters:** Circular diagrams representing the 28-day cycle or weekly training load should be divided into clean segments. Use Deep Plum for completed segments and the Background color for remaining segments.
- **Lists:** Use "Horizontal Rule" dividers between list items. Use a monospaced-style numeral (from Public Sans) for ordered lists to emphasize the sequential, scientific nature of the coaching.
- **Photography:** Images must be documentary-style (natural light, high contrast, slightly desaturated). Grade photos to lean into plum shadows and amber highlights. No high-gloss fitness photography.