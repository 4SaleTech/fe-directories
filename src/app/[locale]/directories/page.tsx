import { getTranslations } from 'next-intl/server';
import { categoryRepository } from '@/infrastructure/repositories/CategoryRepository';
import Link from 'next/link';
import styles from './page.module.scss';

interface DirectoriesPageProps {
  params: {
    locale: string;
  };
}

export default async function DirectoriesPage({ params }: DirectoriesPageProps) {
  const { locale } = params;
  const t = await getTranslations('directories');

  // Fetch all categories
  const categories = await categoryRepository.getAllCategories(locale);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/directories/${category.slug}`}
            className={styles.categoryCard}
          >
            <div className={styles.categoryIcon}>{category.icon}</div>
            <h3 className={styles.categoryName}>
              {locale === 'ar' ? category.name_ar : category.name}
            </h3>
            {category.description && (
              <p className={styles.categoryDescription}>
                {locale === 'ar' ? category.description_ar : category.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
