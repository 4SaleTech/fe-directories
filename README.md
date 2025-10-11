# 4Sale Directories Frontend

A Next.js-based business directories platform for 4Sale, built with Clean Architecture and SCSS modules for optimal SEO performance.

## 🚀 Tech Stack

- **Next.js 14** - App Router for server-side rendering and SEO
- **TypeScript** - Type safety throughout the application
- **SCSS Modules** - Component-scoped styling with design tokens
- **Clean Architecture** - Separation of concerns (Domain, Application, Infrastructure, Presentation)
- **Axios** - API client with request/response interceptors

## 📁 Project Structure

```
src/
├── domain/              # Business logic & entities
│   ├── entities/        # Business, Category, Article entities
│   └── repositories/    # Repository interfaces
├── application/         # Use case implementations
│   ├── services/        # Application services
│   └── dto/            # Data transfer objects
├── infrastructure/      # External concerns
│   ├── api/            # API client & interceptors
│   ├── repositories/   # Repository implementations
│   └── utils/          # Utility functions
├── presentation/        # UI Layer
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-specific components
│   └── styles/         # Global SCSS, variables, mixins
└── app/                # Next.js App Router pages
```

## 🎨 Design System

The application uses a comprehensive design system with:
- **Color Palette**: Primary blue (#2563EB), backgrounds, text colors
- **Typography**: Tajawal font for Arabic, system fonts for English
- **Spacing Scale**: 4px base unit (4, 8, 12, 16, 24, 32, 40, 48, 64px)
- **Responsive Breakpoints**: Mobile, Tablet, Desktop, XL
- **RTL/LTR Support**: Full bidirectional text support

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_DEVICE_ID=00000001-e89b-12d3-a456-426614174000
NEXT_PUBLIC_DEVICE_TYPE=web
NEXT_PUBLIC_VERSION_NUMBER=30.5.4
NEXT_PUBLIC_APPLICATION_SOURCE=q84sale
\`\`\`

## 📄 Key Pages

- `/` - Homepage with directory entry point
- `/directories` - Main directories landing page
- `/directories/[category]` - Category listing page
- `/directories/businesses/[slug]` - Business profile page
- `/directories/search` - Search results page

## 🎯 Features

### Main Landing Page
- ✅ Hero banner with carousel
- ✅ Category grid (8 categories)
- ✅ Featured businesses section
- ✅ Horizontal scroll on desktop
- ✅ 2-column grid on mobile
- ✅ Responsive design

### Components Built
- **HeroBanner** - Full-width carousel banner
- **CategoryGrid** - Circular category icons
- **RestaurantCard** - Business card with image, rating, pricing
- **FeaturedSection** - Section with horizontal scroll/grid

## 🌐 Bilingual Support

The application supports both Arabic (RTL) and English (LTR):
- Arabic is the default language
- RTL layout for Arabic content
- LTR layout for English content
- Font switching based on locale

## 📦 API Integration

The API client is pre-configured with:
- Base URL: `localhost:8080`
- Standard headers (Device-Id, Device-Type, Version-Number, Application-Source)
- Accept-Language header for i18n
- Request/response interceptors
- Error handling

### Example API Calls

\`\`\`typescript
import { businessRepository } from '@/infrastructure/repositories/BusinessRepository';

// Get business by slug
const business = await businessRepository.getBusinessBySlug('restaurant-name', 'ar');

// Search businesses
const results = await businessRepository.searchBusinesses('coffee');

// Get featured businesses by category
const featured = await businessRepository.getBusinessesByCategory('restaurants', {
  page: 1,
  limit: 10,
  sort: 'rating'
});
\`\`\`

## 🎨 Adding Images

Place your images in the `public/images/` directory:
- Hero banner: `hero-building.jpg`
- Food samples: `food-sample.jpg`
- Placeholder: `placeholder.jpg`

## 📝 Next Steps

1. **Add real images** to `public/images/`
2. **Connect to backend API** - Update API endpoints in repositories
3. **Implement remaining pages**:
   - Category listing page
   - Business profile page
   - Search page
4. **Add authentication** for user features
5. **Implement owner dashboard** for business management

## 🔨 Development Guidelines

### Adding a New Component

1. Create component directory in `src/presentation/components/`
2. Create `.tsx` and `.module.scss` files
3. Use design tokens from `_variables.scss`
4. Import and use mixins from `_mixins.scss`
5. Ensure responsive design with breakpoint mixins

### Styling Best Practices

- Use CSS Modules for component-scoped styles
- Import design tokens: `@import '@/presentation/styles/variables';`
- Use mixins for common patterns
- Follow BEM naming convention for class names
- Ensure RTL compatibility with logical properties

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [SCSS Documentation](https://sass-lang.com/documentation)

## 🤝 Contributing

1. Follow Clean Architecture principles
2. Write type-safe code
3. Use design tokens for consistency
4. Test responsive behavior
5. Ensure RTL/LTR compatibility

---

Built with ❤️ for 4Sale
