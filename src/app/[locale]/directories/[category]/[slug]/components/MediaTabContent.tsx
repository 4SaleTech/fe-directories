import { BusinessMedia } from '@/domain/entities/Business';
import { MediaSection } from './';
import styles from './TabContent.module.scss';

interface MediaTabContentProps {
  media: BusinessMedia[];
  locale: string;
}

export default function MediaTabContent({ media, locale }: MediaTabContentProps) {
  return (
    <div className={styles.tabContent}>
      {media && media.length > 0 ? (
        <MediaSection media={media} locale={locale} />
      ) : (
        <div className={styles.emptyState}>
          <p>{locale === 'ar' ? 'لا توجد صور أو فيديوهات' : 'No media available'}</p>
        </div>
      )}
    </div>
  );
}
