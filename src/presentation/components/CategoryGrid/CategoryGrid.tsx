import Link from 'next/link';
import { Category } from '@/domain/entities/Category';
import styles from './CategoryGrid.module.scss';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className={styles.categoryGrid}>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/directories/${category.slug}`}
            className={styles.categoryCard}
          >
            <div className={styles.iconWrapper}>
              {category.icon ? (
                <span className={styles.icon}>{category.icon}</span>
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <span className={styles.label}>{category.name_ar || category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
