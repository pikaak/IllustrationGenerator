# Mystical Cat Tarot Generator

## Overview

The Mystical Cat Tarot Generator is a full-stack web application that uses AI to generate mystical cat-themed tarot card illustrations. Users can generate individual cards from the Major Arcana or create the entire deck at once. The application features a gallery-style interface for browsing generated cards and supports downloading individual images or the complete collection.

The project combines a React frontend with shadcn/ui components, an Express backend, and Google's Gemini AI for image generation. Generated images are stored on the filesystem and served statically.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite for build tooling

**UI Component System**: shadcn/ui (based on Radix UI primitives) with Tailwind CSS for styling. The design follows a "new-york" style variant with ornate, mystical aesthetics inspired by art gallery presentations and astrology applications.

**Typography Strategy**: Multi-tier font system using Google Fonts:
- Display fonts (Cinzel/Playfair Display) for headings to convey mystical elegance
- Serif fonts (Cormorant Garamond) for body text
- Sans-serif (Inter/DM Sans) for UI elements and controls

**State Management**: TanStack Query (React Query) for server state management with polling for real-time updates during batch generation. No global client state management library is used.

**Routing**: Wouter for lightweight client-side routing (single-page application with home and 404 routes)

**Key Design Patterns**:
- Component composition with separate concerns (hero section, generation interface, gallery, modals)
- Custom hooks for mobile detection and toast notifications
- Responsive design with mobile-first approach using Tailwind breakpoints

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API with two main endpoints:
- `GET /api/cards` - Retrieves all generated tarot cards
- `POST /api/generate` - Generates a single tarot card or batch of cards

**Data Storage Strategy**: Dual-layer approach:
- In-memory storage (MemStorage class) for card metadata (name, image URL, prompt, generation timestamp)
- Filesystem storage for generated image files in `generated_images/` directory
- Images are base64-decoded and saved with MD5-hashed filenames following pattern: `The_[CardName]_tarot_card_[hash].png`

**Rationale**: In-memory storage chosen for simplicity and fast access. The application includes infrastructure for PostgreSQL via Drizzle ORM (schema defined, Neon serverless driver included), suggesting future migration path to persistent database storage.

**Development vs Production**: Vite middleware integration in development mode with SSR template serving. Production builds serve static assets from `dist/public`.

### AI Integration

**Provider**: Google Gemini AI via Replit's AI Integrations service

**Model**: `gemini-2.5-flash-image` for multimodal content generation (text + image output)

**Prompt Engineering**: Fixed template for consistent styling: "Mystical cat-themed tarot card illustrations for {cardName}, ornate border, mystical atmosphere, 2:3 aspect ratio"

**Reliability Mechanisms**:
- Rate limit detection and retry logic using `p-retry` library
- Concurrency control with `p-limit` for batch generation (prevents API quota exhaustion)
- Error handling with fallback messages for generation failures

**Image Processing**: Generated images returned as base64-encoded data URLs, then converted to binary and saved to filesystem

### External Dependencies

**Core Libraries**:
- `@google/genai` - Google Gemini AI SDK for image generation
- `@tanstack/react-query` - Server state management and caching
- `drizzle-orm` with `@neondatabase/serverless` - ORM and PostgreSQL driver (configured but not actively used for data persistence)
- `express` - Web server framework
- `react` and `react-dom` - UI library
- `vite` - Build tool and dev server
- `wouter` - Client-side routing

**UI Component System**:
- `@radix-ui/*` - Headless UI primitives (20+ components for dialogs, dropdowns, tooltips, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` and `clsx` - Conditional className utilities

**Development Tools**:
- `typescript` - Type safety
- `drizzle-kit` - Database migration tool
- `@replit/*` plugins - Replit-specific development enhancements (error overlay, cartographer, dev banner)

**Image Processing & Utilities**:
- `p-limit` - Concurrency control for batch operations
- `p-retry` - Retry logic with exponential backoff
- `date-fns` - Date manipulation
- `nanoid` - Unique ID generation
- `lucide-react` - Icon library

**Session Management**: `connect-pg-simple` for PostgreSQL session store (infrastructure present but not actively implemented)

**Font Loading**: Google Fonts CDN for Cinzel, Cormorant Garamond, Inter, and DM Sans font families

### Configuration & Environment

**Build Configuration**:
- TypeScript with ESNext module resolution and bundler mode
- Path aliases: `@/` for client source, `@shared/` for shared types, `@assets/` for static assets
- Separate build processes for client (Vite) and server (esbuild)

**Environment Variables Required**:
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API authentication (provided by Replit)
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini API endpoint (provided by Replit)
- `DATABASE_URL` - PostgreSQL connection string (configured in drizzle.config.ts but optional for current memory-based storage)

**Static File Serving**:
- Generated images served from `/images` endpoint mapped to `generated_images/` directory
- Client assets built to `dist/public` and served in production