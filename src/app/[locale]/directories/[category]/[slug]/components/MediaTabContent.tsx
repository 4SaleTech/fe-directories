import { useTranslations } from 'next-intl';
import { BusinessMedia } from '@/domain/entities/Business';
import { MediaSection } from './';
import styles from './TabContent.module.scss';

interface MediaTabContentProps {
  media: BusinessMedia[];
  locale: string;
  isMenuTab?: boolean;
}

export default function MediaTabContent({ media, locale, isMenuTab = false }: MediaTabContentProps) {
  const t = useTranslations('business');
  const title = isMenuTab ? t('menu') : undefined;

  return (
    <div className={styles.tabContent}>
      {media && media.length > 0 ? (
        <MediaSection
          media={media}
          locale={locale}
          title={title}
          isMenuLayout={isMenuTab}
        />
      ) : (
        <div className={styles.emptyState}>
          <p>{locale === 'ar' ? 'لا توجد صور أو فيديوهات' : 'No media available'}</p>
        </div>
      )}
    </div>
  );
}
