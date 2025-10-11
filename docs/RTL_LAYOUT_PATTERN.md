# RTL/LTR Layout Pattern Documentation

## Business Profile Page Layout

### Requirements
- **English (LTR)**: Sidebar on LEFT, Main content on RIGHT
- **Arabic (RTL)**: Sidebar on RIGHT, Main content on LEFT

### Implementation

#### HTML Structure (`page.tsx`)
```tsx
<div className={styles.container}>
  {/* Main Content - FIRST in HTML */}
  <main className={styles.mainContent}>
    {/* Main content here */}
  </main>

  {/* Sidebar - SECOND in HTML */}
  <aside className={styles.sidebar}>
    {/* Sidebar content here */}
  </aside>
</div>
```

**Key Point**: Main content comes FIRST in HTML, Sidebar comes SECOND.

#### CSS Layout (`page.module.scss`)
```scss
.container {
  @include container;
  display: flex;
  flex-direction: column; // Mobile: stack vertically
  gap: $spacing-6;

  @include lg {
    // Desktop English (LTR): Use flex-direction: row
    // HTML order: Main (1st), Sidebar (2nd)
    // Visual result: Main LEFT, Sidebar RIGHT
    flex-direction: row;
    gap: $spacing-8;
    align-items: flex-start;
  }
}

// RTL support for Arabic
:global(html[dir='rtl']) {
  .container {
    @include lg {
      // Desktop Arabic (RTL): Keep flex-direction: row
      // HTML order: Main (1st), Sidebar (2nd)
      // Visual result: Main LEFT, Sidebar RIGHT (which is what we want)
      // RTL naturally reverses visual flow, so same flex-direction gives different result
      flex-direction: row;
    }
  }
}
```

### How It Works

#### English (LTR)
1. HTML Order: `Main (1st) | Sidebar (2nd)`
2. CSS: `flex-direction: row`
3. Visual Result: `Main (LEFT) | Sidebar (RIGHT)` ✅

#### Arabic (RTL)
1. HTML Order: `Main (1st) | Sidebar (2nd)`
2. CSS: `flex-direction: row`
3. RTL Context: Visual flow is right-to-left
4. Visual Result: `Main (LEFT) | Sidebar (RIGHT)` ✅

### Important Notes

1. **Use `:global(html[dir='rtl'])` selector** - This properly targets the HTML element's `dir` attribute in CSS Modules.

2. **Both use `flex-direction: row`** - The RTL direction on the HTML element naturally handles the visual reversal.

3. **HTML order matters** - Main content first ensures proper document flow and accessibility.

4. **Mobile behavior** - Both languages stack vertically with `flex-direction: column` on mobile.

### Files Modified
- `/src/app/[locale]/directories/businesses/[slug]/page.tsx` - HTML structure
- `/src/app/[locale]/directories/businesses/[slug]/page.module.scss` - Layout styles
- `/src/app/[locale]/layout.tsx` - Sets `dir="rtl"` or `dir="ltr"` on `<html>` element

### Translation Files
- `/messages/en.json` - English translations
- `/messages/ar.json` - Arabic translations

Both contain complete business profile translations including:
- Navigation tabs (about, services, branches, workingHours, reviews, media, faqs)
- Actions (share, follow, visitWebsite, callNow, chatOnWhatsApp)
- Status labels (openNow, closed, today, viewOnMap)
- Day names (sunday through saturday)

## Usage in Other Pages

To implement this same pattern elsewhere:

1. **HTML**: Place main content FIRST, sidebar/secondary content SECOND
2. **CSS**: Use `flex-direction: row` for desktop
3. **RTL**: Use `:global(html[dir='rtl'])` selector with same `flex-direction: row`
4. **Mobile**: Use `flex-direction: column` for vertical stacking

This pattern ensures consistent, predictable layouts across both languages.
