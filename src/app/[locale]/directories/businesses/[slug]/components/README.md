# Business Profile Components

This directory contains all the components for the business profile page in the Next.js 14 app.

## Components Overview

### 1. BusinessSidebar
**Location:** `BusinessSidebar.tsx`

The right sidebar component containing:
- Hero banner image with business avatar
- Share and Follow action buttons
- Business name with verification badge
- Star rating and review count
- Business description
- Website link
- Call Now CTA button (primary action)
- WhatsApp button (if available)
- Social media links

**Props:**
```typescript
{
  business: Business;
  locale: string;
}
```

### 2. BusinessTabs
**Location:** `BusinessTabs.tsx`

Sticky tab navigation component that allows switching between different sections:
- About
- Services
- Branches
- Working Hours
- Reviews
- Media
- FAQs

**Props:**
```typescript
{
  availableTabs: AvailableTabs;
  onTabChange?: (tab: string) => void;
}
```

### 3. BranchesSection
**Location:** `BranchesSection.tsx`

Displays a list of business branches with:
- Branch name
- Address with location icon
- "View on Map" button (opens Google Maps)
- Contact phone number with call button

**Props:**
```typescript
{
  branches: Branch[];
  locale: string;
}
```

### 4. WorkingHoursSection
**Location:** `WorkingHoursSection.tsx`

Shows weekly working hours schedule:
- Days of the week (Mon-Sun)
- Opening and closing times
- Highlights current day
- Shows "Closed" for non-working days
- Supports both 12-hour and 24-hour formats

**Props:**
```typescript
{
  workingHours: WorkingHours[];
  locale: string;
}
```

### 5. FAQSection
**Location:** `FAQSection.tsx`

Accordion-style FAQ list:
- Expandable/collapsible questions
- Smooth animations
- Supports multiple open items
- Filters only active FAQs
- Sorts by display order

**Props:**
```typescript
{
  faqs: FAQ[];
  locale: string;
}
```

## Usage Example

```tsx
import { useLocale } from 'next-intl';
import {
  BusinessSidebar,
  BusinessTabs,
  BranchesSection,
  WorkingHoursSection,
  FAQSection,
} from './components';

export default function BusinessProfilePage({ params }: { params: { slug: string } }) {
  const locale = useLocale();

  // Fetch business data (example)
  const business = await getBusinessBySlug(params.slug);
  const branches = await getBranches(business.id);
  const workingHours = await getWorkingHours(business.id);
  const faqs = await getFAQs(business.id);

  return (
    <div className="businessProfile">
      <div className="container">
        <div className="layout">
          {/* Main Content - Left Column (792px) */}
          <main className="mainContent">
            <BusinessTabs availableTabs={business.available_tabs} />

            <section id="about">
              {/* About content */}
            </section>

            <BranchesSection branches={branches} locale={locale} />
            <WorkingHoursSection workingHours={workingHours} locale={locale} />
            <FAQSection faqs={faqs} locale={locale} />
          </main>

          {/* Sidebar - Right Column (384px) */}
          <BusinessSidebar business={business} locale={locale} />
        </div>
      </div>
    </div>
  );
}
```

## Layout Structure

The business profile page uses a 2-column layout:

```
┌─────────────────────────────────────────────────────┐
│                    Container                        │
│  ┌────────────────────┬────────────────────────┐   │
│  │   Main Content     │      Sidebar           │   │
│  │   (792px)          │      (384px)           │   │
│  │                    │                        │   │
│  │  - Tabs            │  - Hero Banner         │   │
│  │  - About           │  - Business Info       │   │
│  │  - Branches        │  - CTA Buttons         │   │
│  │  - Working Hours   │  - Social Links        │   │
│  │  - FAQs            │                        │   │
│  │                    │  (Sticky)              │   │
│  └────────────────────┴────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Styling

All components use SCSS modules with:
- Design system variables from `@/presentation/styles/_variables`
- Reusable mixins from `@/presentation/styles/_mixins`
- RTL support (Arabic/English)
- Responsive breakpoints
- 4Sale design system (primary color: #0062FF)

## Internationalization

All components support i18n using `next-intl`:
- Translation keys are in the `business` namespace
- Components accept `locale` prop for language-specific content
- RTL layout support for Arabic

### Required Translation Keys

Add these keys to your translation files:

**English (en.json):**
```json
{
  "business": {
    "share": "Share",
    "follow": "Follow",
    "following": "Following",
    "reviews": "reviews",
    "visitWebsite": "Visit Website",
    "callNow": "Call Now",
    "chatOnWhatsApp": "Chat on WhatsApp",
    "about": "About",
    "services": "Services",
    "branches": "Branches",
    "workingHours": "Working Hours",
    "reviews": "Reviews",
    "media": "Media",
    "faqs": "FAQs",
    "viewOnMap": "View on Map",
    "today": "Today",
    "closed": "Closed",
    "sunday": "Sunday",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday"
  }
}
```

**Arabic (ar.json):**
```json
{
  "business": {
    "share": "مشاركة",
    "follow": "متابعة",
    "following": "متابع",
    "reviews": "تقييم",
    "visitWebsite": "زيارة الموقع",
    "callNow": "اتصل الآن",
    "chatOnWhatsApp": "دردشة واتساب",
    "about": "حول",
    "services": "الخدمات",
    "branches": "الفروع",
    "workingHours": "ساعات العمل",
    "reviews": "التقييمات",
    "media": "الوسائط",
    "faqs": "الأسئلة الشائعة",
    "viewOnMap": "عرض على الخريطة",
    "today": "اليوم",
    "closed": "مغلق",
    "sunday": "الأحد",
    "monday": "الإثنين",
    "tuesday": "الثلاثاء",
    "wednesday": "الأربعاء",
    "thursday": "الخميس",
    "friday": "الجمعة",
    "saturday": "السبت"
  }
}
```

## Features

### BusinessSidebar
- ✅ Native Web Share API with clipboard fallback
- ✅ Follow/Unfollow toggle with state management
- ✅ Direct tel: links for calling
- ✅ WhatsApp deep linking
- ✅ External social media links
- ✅ Verified badge display
- ✅ Responsive avatar with overlay

### BusinessTabs
- ✅ Conditional tab display based on available content
- ✅ Smooth scroll to sections
- ✅ Active tab highlighting
- ✅ Sticky positioning
- ✅ Horizontal scroll on mobile

### BranchesSection
- ✅ Google Maps integration
- ✅ Coordinates-based or address-based map links
- ✅ Click-to-call functionality
- ✅ Hover effects and transitions

### WorkingHoursSection
- ✅ Current day highlighting
- ✅ 12-hour/24-hour format support
- ✅ Locale-aware time display
- ✅ Closed day indicators

### FAQSection
- ✅ Accordion with smooth animations
- ✅ Multiple items can be open simultaneously
- ✅ Keyboard accessible
- ✅ Auto-sorts by display order
- ✅ Filters inactive FAQs

## Type Safety

All components are fully typed with TypeScript using the Business entity types from:
`@/domain/entities/Business.ts`

## Accessibility

- Semantic HTML elements
- ARIA labels and attributes
- Keyboard navigation support
- Focus visible states
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- RTL layout support
- Responsive design (mobile, tablet, desktop)
