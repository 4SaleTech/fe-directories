import Link from 'next/link';
import { Category } from '@/domain/entities/Category';
import IconRenderer from '@/presentation/components/IconRenderer/IconRenderer';
import styles from './CategoryGrid.module.scss';

interface CategoryGridProps {
  categories: Category[];
  locale?: string;
}

const CategoryGrid = ({ categories, locale = 'ar' }: CategoryGridProps) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className={styles.categoryGrid}>
      <h2 className={styles.sectionTitle} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {locale === 'ar' ? 'الفئات' : 'Categories'}
      </h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/directories/${category.slug}`}
            className={styles.categoryCard}
          >
            <div className={styles.iconWrapper}>
              {category.icon ? (
                <IconRenderer value={category.icon} size={48} className={styles.icon} />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <span className={styles.label}>
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
