# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 business directories frontend for 4Sale, built with Clean Architecture, TypeScript, and SCSS modules. The primary goal is SEO optimization to increase 4Sale Duas impressions through directory business listings.

## Architecture

### Clean Architecture Layers

1. **Domain Layer** (`src/domain/`)
   - Pure business logic and entities
   - No external dependencies
   - Entities: Business, Category, Article, Review, Service, WorkingHours, Branch

2. **Application Layer** (`src/application/`)
   - Use case implementations
   - Application services
   - DTOs for data transfer

3. **Infrastructure Layer** (`src/infrastructure/`)
   - API client with Axios
   - Repository implementations
   - External service integrations
   - API base URL: `http://localhost:8080`
   - Standard headers: Device-Id, Device-Type, Accept-Language, Version-Number, Application-Source

4. **Presentation Layer** (`src/presentation/`)
   - React components (Server & Client)
   - SCSS Modules for styling
   - Feature-specific UI logic

5. **App Layer** (`src/app/`)
   - Next.js App Router pages
   - Server-side rendering for SEO

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Design System

### Color Palette
- Primary: `#2563EB` (blue)
- Background: `#F8FAFC` (light gray)
- Surface: `#FFFFFF` (white)
- Text Primary: `#1E293B`
- Text Secondary: `#64748B`
- Rating: `#FBBF24` (yellow)

### Typography
- Arabic: Tajawal font (weights: 400, 500, 700)
- English: System fonts
- Font sizes: xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px), 4xl(36px)

### Spacing Scale
Based on 4px unit: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80px

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Key Features

### Pages Implemented
- `/` - Homepage entry point
- `/directories` - Main landing page with categories and featured businesses

### Components
- **HeroBanner** - Carousel banner with CTA
- **CategoryGrid** - 8 circular category icons (mobile only)
- **RestaurantCard** - Business card with image, rating, price, distance
- **FeaturedSection** - Horizontal scroll (desktop) / 2-column grid (mobile)

### Responsive Behavior
- Desktop: Horizontal scrolling for featured sections
- Mobile: 2-column grid layout
- Category grid only visible on mobile
- Container max-width: 1280px

## API Integration

### Repository Pattern
All API calls go through repositories in `src/infrastructure/repositories/`:
- `BusinessRepository` - Business CRUD, search, reviews, services
- `CategoryRepository` - Category listings

### Standard Headers
Every API request includes:
```typescript
{
  'Device-Id': process.env.NEXT_PUBLIC_DEVICE_ID,
  'Device-Type': 'web',
  'Accept-Language': 'ar' | 'en',
  'Version-Number': '30.5.4',
  'Application-Source': 'q84sale'
}
```

## Bilingual Support

- Default language: Arabic (RTL)
- Alternative: English (LTR)
- `[dir='rtl']` and `[dir='ltr']` CSS selectors
- Use logical properties: `margin-inline`, `padding-inline`, `inset-inline-start`

## Styling Guidelines

1. **Always use SCSS Modules** - `.module.scss` files
2. **Import design tokens**:
   ```scss
   @import '@/presentation/styles/variables';
   @import '@/presentation/styles/mixins';
   ```
3. **Use mixins** for breakpoints: `@include md { ... }`
4. **Follow BEM naming** for class names
5. **Ensure RTL compatibility** - avoid `left`/`right`, use logical properties

## Important Patterns

### Client vs Server Components
- Use `'use client'` only when needed (interactivity, hooks)
- Prefer Server Components for better SEO
- API calls in Server Components for SSR

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={business.cover_image}
  alt={business.name_ar}
  fill
  sizes="(max-width: 768px) 50vw, 250px"
/>
```

### Link Navigation
```typescript
import Link from 'next/link';

<Link href={`/directories/${category.slug}`}>
  {category.name_ar}
</Link>
```

## File Structure Conventions

```
ComponentName/
├── ComponentName.tsx       # Component logic
└── ComponentName.module.scss  # Component styles
```

## SEO Optimization

- Server-side rendering (SSR) for all content pages
- Semantic HTML structure
- Proper meta tags in page components
- Image optimization with Next.js Image
- Clean URLs with slugs

## Testing Notes

- Mock data currently used in `/directories` page
- Replace with actual API calls when backend is ready
- Add placeholder images to `public/images/` directory

## Common Tasks

### Adding a New Page
1. Create in `src/app/[route]/page.tsx`
2. Add metadata for SEO
3. Use Server Component by default
4. Import reusable components from `presentation/`

### Adding a New Component
1. Create folder in `src/presentation/components/`
2. Create `.tsx` and `.module.scss` files
3. Use design tokens and mixins
4. Export from component file

### Adding a New API Endpoint
1. Add method to appropriate repository
2. Use `apiClient` from `infrastructure/api/client.ts`
3. Return typed data using domain entities
4. Handle errors in interceptor

## Important Files

- `src/presentation/styles/_variables.scss` - All design tokens
- `src/presentation/styles/_mixins.scss` - Reusable SCSS mixins
- `src/presentation/styles/globals.scss` - Global styles
- `src/infrastructure/api/client.ts` - API client configuration
- `.env.local` - Environment variables (not committed)
