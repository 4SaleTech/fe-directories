import { ForSaleService } from '@/domain/entities/ForSale';
import ServiceCard from './ServiceCard';
import styles from './ServicesSection.module.scss';

interface ServicesSectionProps {
  services: ForSaleService[];
  locale: string;
}

export default function ServicesSection({ services, locale }: ServicesSectionProps) {
  const sectionTitle = locale === 'ar' ? 'الخدمات' : 'Services';

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.servicesList}>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} locale={locale} />
        ))}
      </div>
    </div>
  );
}
