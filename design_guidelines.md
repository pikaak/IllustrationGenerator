# Design Guidelines: Mystical Cat Tarot Generator

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Behance/Dribbble**: Art gallery presentation and card showcase patterns
- **Cosmos/Astrology Apps**: Mystical atmosphere and ethereal interfaces
- **Museum/Gallery Sites**: High-quality image presentation and detail views

**Core Principles:**
1. Mystical atmosphere through ornate details and ethereal treatments
2. Premium gallery experience showcasing AI-generated artwork
3. Intuitive generation and download workflows
4. Balance between ancient tarot mysticism and modern interface design

---

## Typography

**Font Families:**
- Primary (Headings): "Cinzel" or "Playfair Display" - Serif fonts with classical, mystical elegance
- Secondary (Body): "Cormorant Garamond" or "Libre Baskerville" - Readable serif for mystical tone
- UI Elements: "Inter" or "DM Sans" - Clean sans-serif for buttons and labels

**Type Scale:**
- Hero Title: text-6xl md:text-7xl lg:text-8xl font-bold
- Section Headings: text-4xl md:text-5xl font-semibold
- Card Names: text-2xl md:text-3xl font-medium
- Body Text: text-base md:text-lg
- UI Labels: text-sm font-medium uppercase tracking-wider

---

## Layout System

**Spacing Primitives:** Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32

**Container Strategy:**
- Full-width hero: w-full with inner max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto
- Gallery grid: max-w-7xl mx-auto

**Vertical Rhythm:**
- Section padding: py-16 md:py-24 lg:py-32
- Component spacing: space-y-8 md:space-y-12
- Card grid gaps: gap-6 md:gap-8

---

## Core Sections & Components

### 1. Hero Section (Full Viewport Impact)
**Layout:** Centered content with mystical atmosphere
- h-screen with flex items-center justify-center
- Layered background with subtle gradient overlay
- Central focus with generous whitespace

**Hero Content:**
- Main title: "Mystical Cat Tarot Generator" with ornate decorative elements (SVG borders/flourishes)
- Subtitle: "Unveil the mysteries through AI-crafted feline divination" 
- Primary CTA: "Generate Your Cards" - Large, prominent button (px-8 py-4 text-lg)
- Trust indicator: "Powered by AI • 16 Major Arcana Cards"
- Decorative elements: Mystical symbols (stars, moons, celestial ornaments) positioned around title

**Background Treatment:**
- Deep, rich gradient (no specific colors mentioned)
- Subtle particle/star effect overlay (CSS or minimal canvas animation)
- Ethereal glow effects around text elements

### 2. Generation Interface Section
**Layout:** Two-column split on desktop (md:grid-cols-2), single column mobile

**Left Column - Controls:**
- Card selector: Custom dropdown/grid showing all 16 card names
- Large, icon-enhanced card buttons in 4x4 grid (grid-cols-2 md:grid-cols-4 gap-4)
- "Generate Selected" primary button
- "Generate All Cards" secondary button
- Progress indicator when generating (mystical loading animation - spinning tarot card or celestial spinner)

**Right Column - Preview:**
- Large preview area showing currently selected/generating card
- Aspect ratio container: aspect-[2/3] for proper tarot proportions
- Empty state: Ornate placeholder with mystical iconography
- Generated state: Full card image with subtle border glow effect

**Prompt Display:**
- Show active prompt in small, elegant text box above preview
- Editable option for advanced users (optional expansion panel)

### 3. Gallery Section
**Layout:** Pinterest-style masonry grid OR structured card grid

**Grid Structure:**
- Desktop: grid-cols-4 gap-6 (4 cards per row)
- Tablet: grid-cols-3 gap-5
- Mobile: grid-cols-2 gap-4

**Card Display:**
- aspect-[2/3] ratio maintained
- Card name overlay at bottom (absolute positioning)
- Hover effects: Subtle scale transform (hover:scale-105 transition-transform duration-300)
- Ornate border treatment on each card
- Shadow depth: shadow-xl with mystical glow

**Gallery Header:**
- "The Major Arcana Collection" title (text-4xl)
- Filter/sort options: "All Cards" | "Generated" | "Pending"
- View toggle: Grid vs. List view icons
- Download All button (secondary style)

### 4. Individual Card Modal/Detail View
**Triggered by:** Clicking any gallery card

**Modal Structure:**
- Full-screen overlay with backdrop blur
- Centered card display at maximum size
- Two-column layout (card | details)

**Card Display Column:**
- Large, high-resolution card image
- Zoom functionality (click to enlarge)
- Navigation arrows to browse cards in sequence

**Details Column:**
- Card name (text-3xl font-bold)
- Generation timestamp
- Prompt used
- Download button (primary, prominent)
- Share button (secondary)
- Regenerate button (tertiary)
- Tarot meaning snippet (optional mystical lore text)

### 5. Footer Section
**Layout:** Full-width with inner max-w-7xl

**Content:**
- App branding/logo repeat
- Quick links: "About" | "Gallery" | "Generate"
- Social sharing icons (mystical styled icons)
- Copyright and AI attribution
- Mystical decorative border at top
- Background: Subtle pattern or texture

---

## Component Library

### Buttons
**Primary (Generate/Download):**
- px-6 py-3 text-base md:px-8 md:py-4 md:text-lg
- Rounded corners: rounded-lg
- Shadow: shadow-lg
- Transition: transition-all duration-200
- When on images: backdrop-blur-md bg-opacity-90

**Secondary (Filters/Options):**
- px-4 py-2 text-sm md:px-6 md:py-3 md:text-base
- Outlined style with 2px border
- rounded-md

**Icon Buttons:**
- p-3 rounded-full
- Used for close, zoom, share actions

### Cards (Gallery Items)
- Ornate border: border-2 with decorative corner elements
- Aspect ratio: aspect-[2/3]
- Border radius: rounded-xl
- Shadow layers: Combined shadow-xl + glow effect
- Hover state: Transform scale + increased shadow

### Input Fields (Card Selection)
- Custom styled select/buttons
- Large touch targets: min-h-12
- Clear visual hierarchy
- Mystical icon integration (tarot symbols per card)

### Loading States
- Mystical spinner: Rotating tarot card or celestial symbol
- Skeleton loaders for gallery with card-shaped placeholders
- Progress bars with ornate design

### Modals/Overlays
- backdrop-blur-lg
- Border with mystical glow
- rounded-2xl
- max-w-6xl on desktop
- Smooth entrance animations (fade + scale)

---

## Images

### Hero Background Image
**Description:** Deep, mystical cosmic scene - starry night sky with nebula effects, subtle moon phases, or abstract mystical patterns. Should feel ethereal and mysterious without overpowering text.

**Placement:** Full viewport background (bg-cover bg-center) with gradient overlay for text legibility

**Treatment:** Parallax scroll effect (optional), blur on edges, vignette darkening

### Card Placeholder Image
**Description:** Ornate tarot card back design with mystical cat silhouette, celestial symbols (stars, moons, suns), and decorative border matching generated cards

**Placement:** Preview area empty state, gallery loading placeholders

### Decorative Elements
- Celestial icons (stars, moons, crescents) - SVG throughout interface
- Ornate corner flourishes for section dividers
- Mystical symbols as bullet points or accent marks

---

## Animations & Interactions

**Use Sparingly - Mystical Accents Only:**
- Card generation: Ethereal fade-in with slight rotation (0.8s ease-out)
- Gallery entrance: Staggered fade-in (each card delays by 50ms)
- Hover interactions: Subtle glow pulse, gentle scale (1.05)
- Modal entrance: Fade + scale from center (0.3s)
- Loading spinner: Smooth rotation with mystical symbol
- Scroll-triggered: Subtle parallax on hero background only

**No Animations For:**
- Standard button clicks (rely on instant feedback)
- Text appearance
- Layout shifts
- Form interactions

---

## Accessibility

- All card images have descriptive alt text: "The [Card Name] - mystical cat tarot card"
- Keyboard navigation throughout gallery (arrow keys, Enter to open modal)
- Focus indicators on all interactive elements (2px outline with mystical glow)
- ARIA labels for icon-only buttons
- Color contrast maintained for all text overlays
- Modal trap focus and ESC to close

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layouts
- Stacked generation interface
- 2-column gallery grid
- Full-screen modals
- Hamburger navigation if needed

**Tablet (768px - 1024px):**
- 2-column generation interface
- 3-column gallery
- Side-panel modals

**Desktop (> 1024px):**
- Full multi-column layouts
- 4-column gallery
- Large detail modals with side-by-side layout
- Hover interactions enabled

---

This design creates a premium, mystical experience that honors tarot tradition while showcasing modern AI capabilities through an elegant, gallery-focused interface.