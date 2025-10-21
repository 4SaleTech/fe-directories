# Changelog - Business Directories Frontend (User-Facing)

## Overview
This is the public-facing frontend for the Business Directories platform. It provides a bilingual (English/Arabic) interface for users to browse businesses, read reviews, and explore categories.

## Recent Updates (2025-10-19)

### Key Features Implemented

#### 1. FilterDropdown Component with Portal Rendering
- **Location**: `src/presentation/components/FilterDropdown/FilterDropdown.tsx`
- **Purpose**: Reusable filter dropdown with proper z-index handling
- **Key Features**:
  - Portal-based rendering to avoid z-index conflicts
  - Dynamic positioning based on trigger button
  - URL parameter management
  - Special handling for verified/featured filters
  - Click-outside-to-close functionality

**Usage Example**:
```typescript
<FilterDropdown
  label="Filter"
  paramName="filter"
  options={[
    { label: 'All', value: 'all' },
    { label: 'Verified', value: 'verified' },
    { label: 'Featured', value: 'featured' },
  ]}
  currentValue={currentFilter}
/>
```

**Special Parameter Handling** (lines 84-96):
```typescript
// "filter" parameter maps to verified/featured URL params
if (paramName === 'filter') {
  if (value === 'verified') {
    params.set('verified', 'true');
    params.delete('featured');
  } else if (value === 'featured') {
    params.set('featured', 'true');
    params.delete('verified');
  } else if (value === 'both') {
    params.set('verified', 'true');
    params.set('featured', 'true');
  }
}
```

#### 2. Bilingual Support with next-intl
- **Location**: `src/i18n.ts`, `src/middleware.ts`
- **Supported Locales**: English (en), Arabic (ar)
- **Features**:
  - Automatic locale detection from URL
  - Locale-based routing: `/en/...`, `/ar/...`
  - RTL support for Arabic

#### 3. Business Directory Structure
**Pages**:
- `/[locale]/page.tsx` - Homepage with categories and featured businesses
- `/[locale]/directories/page.tsx` - All directories listing
- `/[locale]/directories/[category]/page.tsx` - Category-specific businesses
- `/[locale]/directories/[category]/[slug]/page.tsx` - Business detail page

**Components**:
- `HeroBanner` - Homepage hero section
- `CategoryGrid` - Category listing grid
- `FeaturedSection` - Featured businesses carousel
- `SearchBar` - Global search with autocomplete
- `BusinessListView` - Business listing with filters
- `RestaurantCard` - Business card component
- `FilterDropdown` - Reusable filter component

#### 4. Business Profile Features
**Location**: `src/app/[locale]/directories/[category]/[slug]/`

**Components**:
- `BusinessProfileClient.tsx` - Main client-side wrapper
- `BusinessTabs.tsx` - Tab navigation (About, Services, Reviews, Media)
- `BusinessSidebar.tsx` - Contact info, hours, map
- `AboutTabContent.tsx` - Business description and details
- `ServicesTabContent.tsx` - Services and pricing
- `ReviewsTabContent.tsx` - Reviews with filtering
- `MediaTabContent.tsx` - Photos and videos
- `AddReviewModal.tsx` - Review submission form
- `LoginModal.tsx` - Authentication modal
- `BranchesSection.tsx` - Branch locations
- `FAQSection.tsx` - Frequently asked questions
- `WorkingHoursSection.tsx` - Business hours display

## Architecture

### Domain-Driven Design Structure
```
src/
├── app/                    # Next.js 14 App Router pages
│   └── [locale]/          # Locale-based routing
├── domain/
│   └── entities/          # Business entities (Category, Business, Review, etc.)
├── infrastructure/
│   ├── api/               # API client configuration
│   └── repositories/      # Data fetching repositories
├── presentation/
│   └── components/        # Reusable UI components
├── lib/                   # Utility functions (SEO, etc.)
├── i18n.ts               # Internationalization config
└── middleware.ts         # Locale routing middleware
```

### Entity Models

**Category** (`domain/entities/Category.ts`):
```typescript
interface Category {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  isActive: boolean;
}
```

**Business** (`domain/entities/Business.ts`):
```typescript
interface Business {
  id: number;
  slug: string;
  name: string;
  nameAr?: string;
  about?: string;
  aboutAr?: string;
  categoryId: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  // ... contact info, location, media, etc.
}
```

**Review** (`domain/entities/Review.ts`):
```typescript
interface Review {
  id: number;
  businessId: number;
  userId: number;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  // ... rating breakdown
}
```

### Repository Pattern

**BusinessRepository** (`infrastructure/repositories/BusinessRepository.ts`):
- `getBusinessBySlug(category, slug)` - Get single business
- `searchBusinesses(filters)` - Search with filters
- `getBusinessesByCategory(category, filters)` - Category listings

**CategoryRepository** (`infrastructure/repositories/CategoryRepository.ts`):
- `getAllCategories()` - Get all active categories
- `getCategoryBySlug(slug)` - Get single category
- `getCategoryTags(categorySlug)` - Get tags for category

**ReviewRepository** (`infrastructure/repositories/ReviewRepository.ts`):
- `getBusinessReviews(businessId)` - Get reviews for business
- `submitReview(review)` - Submit new review

**ForSaleRepository** (`infrastructure/repositories/ForSaleRepository.ts`):
- `getUserData(token)` - Get user data from 4Sale OAuth

## API Integration

### Backend API
- **Base URL**: `http://localhost:8080` (dev) / `https://directories.onrender.com` (production)
- **API Version**: `/api/v2`

**Main Endpoints**:
- `GET /api/v2/categories` - List all categories
- `GET /api/v2/categories/:slug` - Get category by slug
- `GET /api/v2/categories/:slug/tags` - Get category tags
- `GET /api/v2/businesses/search` - Search businesses
- `GET /api/v2/businesses/:slug` - Get business details
- `GET /api/v2/reviews` - Get reviews with filters
- `POST /api/v2/reviews` - Submit review (requires auth)

**Filter Parameters**:
- `category_slug` - Filter by category
- `verified=true` - Show only verified businesses
- `featured=true` - Show only featured businesses
- `tags[]` - Filter by tags (array)
- `filters[slug]=value` - Dynamic filter options
- `sort` - Sort by: `newest`, `name`, `rating`, `views`
- `page`, `limit` - Pagination

### 4Sale OAuth Integration
- **Base URL**: `https://apis.q84sale.com`
- **Auth Flow**: OAuth token → User data
- **Used For**: User authentication, review submission

## Key Files and Their Purpose

### `/src/presentation/components/FilterDropdown/FilterDropdown.tsx`
**Purpose**: Reusable filter dropdown with portal rendering

**Why Portal Rendering**:
- Avoids z-index conflicts with parent containers
- Ensures dropdown always appears on top
- Dynamic positioning based on trigger button

**Portal Implementation** (lines 140-165):
```typescript
{mounted && isOpen && createPortal(
  <div
    ref={dropdownRef}
    className={styles.dropdownPortal}
    style={{
      position: 'fixed',
      top: `${dropdownPosition.top}px`,
      left: `${dropdownPosition.left}px`,
      width: `${dropdownPosition.width}px`,
      zIndex: 9999,
    }}
  >
    {/* Options */}
  </div>,
  document.body
)}
```

### `/src/app/[locale]/directories/[category]/page.tsx`
**Purpose**: Category-specific business listing page

**Features**:
- Server-side category data fetching
- Client-side filtering and sorting
- Tag filtering
- Dynamic filter options based on category
- Pagination

### `/src/app/[locale]/directories/[category]/[slug]/page.tsx`
**Purpose**: Business detail page

**Features**:
- Server-side business data fetching
- SEO metadata generation
- Tab-based content organization
- Review display and submission
- Branch locations
- Working hours
- Media gallery

### `/src/infrastructure/api/client.ts`
**Purpose**: Centralized API client configuration

**Features**:
- Base URL configuration
- Request/response interceptors
- Error handling
- TypeScript types

## Internationalization (i18n)

### Locale Configuration
**File**: `src/i18n.ts`

**Supported Locales**: `['en', 'ar']`
**Default Locale**: `'en'`

### Middleware
**File**: `src/middleware.ts`

Handles automatic locale detection and routing:
```typescript
export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});
```

### Usage in Components
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('ComponentName');
<h1>{t('title')}</h1>
```

## SEO Configuration

**File**: `src/lib/seo.ts`

Provides utilities for:
- Meta tags generation
- Open Graph tags
- Twitter Cards
- Structured data (JSON-LD)
- Canonical URLs

## Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Development URL**: http://localhost:3000

**Environment Variables**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v2
NEXT_PUBLIC_FORSALE_API_URL=https://apis.q84sale.com
```

## Tech Stack
- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript 5
- **React**: 18.3.1
- **Internationalization**: next-intl 3.26.1
- **HTTP Client**: Axios 1.7.9
- **Styling**: SCSS Modules
- **Deployment**: Vercel (recommended)

## Common Issues

### FilterDropdown Not Appearing Above Content
**Symptoms**: Dropdown menu hidden behind other elements
**Solution**: Component uses portal rendering to document.body with z-index 9999

### Locale Not Detected
**Symptoms**: Always shows default locale
**Solution**: Ensure URL includes locale prefix: `/en/...` or `/ar/...`

### API Calls Failing
**Symptoms**: Network errors, CORS issues
**Solution**:
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Ensure backend is running on correct port
3. Verify CORS settings on backend

### Build Errors
**Symptoms**: Build fails with type errors
**Solution**:
```bash
rm -rf .next
npm install
npm run build
```

## Directory Structure Detail
```
fe-directories/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── page.tsx                          # Homepage
│   │       ├── layout.tsx                        # Root layout
│   │       └── directories/
│   │           ├── page.tsx                      # All directories
│   │           └── [category]/
│   │               ├── page.tsx                  # Category listing
│   │               └── [slug]/
│   │                   ├── page.tsx              # Business detail
│   │                   ├── BusinessProfileClient.tsx
│   │                   └── components/
│   │                       ├── BusinessTabs.tsx
│   │                       ├── BusinessSidebar.tsx
│   │                       ├── AboutTabContent.tsx
│   │                       ├── ServicesTabContent.tsx
│   │                       ├── ReviewsTabContent.tsx
│   │                       ├── MediaTabContent.tsx
│   │                       ├── AddReviewModal.tsx
│   │                       ├── LoginModal.tsx
│   │                       ├── BranchesSection.tsx
│   │                       ├── FAQSection.tsx
│   │                       ├── WorkingHoursSection.tsx
│   │                       ├── ReviewCard.tsx
│   │                       ├── ServiceCard.tsx
│   │                       └── index.ts
│   ├── domain/
│   │   └── entities/
│   │       ├── Business.ts
│   │       ├── Category.ts
│   │       ├── Review.ts
│   │       ├── Tag.ts
│   │       ├── Section.ts
│   │       ├── Article.ts
│   │       └── ForSale.ts
│   ├── infrastructure/
│   │   ├── api/
│   │   │   └── client.ts
│   │   └── repositories/
│   │       ├── BusinessRepository.ts
│   │       ├── CategoryRepository.ts
│   │       ├── ReviewRepository.ts
│   │       ├── TagRepository.ts
│   │       ├── SectionRepository.ts
│   │       ├── FilterRepository.ts
│   │       └── ForSaleRepository.ts
│   ├── presentation/
│   │   └── components/
│   │       ├── HeroBanner/
│   │       ├── CategoryGrid/
│   │       ├── FeaturedSection/
│   │       ├── SearchBar/
│   │       ├── BusinessListView/
│   │       ├── RestaurantCard/
│   │       ├── FilterDropdown/
│   │       │   ├── FilterDropdown.tsx
│   │       │   └── FilterDropdown.module.scss
│   │       └── LanguageSwitcher/
│   ├── lib/
│   │   └── seo.ts
│   ├── i18n.ts
│   └── middleware.ts
├── public/
├── package.json
├── tsconfig.json
└── next.config.js
```

## Performance Optimizations

### Server-Side Rendering (SSR)
- Category and business pages use SSR for SEO
- Initial data fetched on server
- Faster first contentful paint

### Client-Side Filtering
- Filter changes don't require page reload
- URL parameters preserve filter state
- Smooth user experience

### Code Splitting
- Components lazy-loaded where appropriate
- Reduces initial bundle size

### Image Optimization
- Next.js Image component for automatic optimization
- WebP format support
- Lazy loading

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables (Production)
```bash
NEXT_PUBLIC_API_URL=https://directories.onrender.com/api/v2
NEXT_PUBLIC_FORSALE_API_URL=https://apis.q84sale.com
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## Next Steps / Roadmap
- [ ] Add user dashboard for business owners
- [ ] Implement advanced search with autocomplete
- [ ] Add favorites/bookmarking functionality
- [ ] Implement social sharing
- [ ] Add business claim workflow
- [ ] Mobile app integration
- [ ] Analytics dashboard
