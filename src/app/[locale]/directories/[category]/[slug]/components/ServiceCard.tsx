import { ForSaleService } from '@/domain/entities/ForSale';
import styles from './ServicesSection.module.scss';

interface ServiceCardProps {
  service: ForSaleService;
  locale: string;
}

export default function ServiceCard({ service, locale }: ServiceCardProps) {
  const { name, icon, price, price_start_from } = service;

  // Format price with KWD currency
  const formatPrice = (price: number) => {
    return `${price.toFixed(1)} ${locale === 'ar' ? 'د.ك' : 'KWD'}`;
  };

  const priceLabel = locale === 'ar' ? 'يبدأ من' : 'Starting from';

  // Determine which price display case to show
  const hasPrice = price !== undefined && price !== null && price > 0;
  const showStartFromLabel = hasPrice && price_start_from === true;

  return (
    <div className={styles.serviceCard}>
      {/* Icon */}
      <div className={styles.serviceIcon}>
        {icon ? (
          <img src={icon} alt={name} className={styles.iconImage} />
        ) : (
          <div className={styles.iconPlaceholder}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M10 6V10M10 14H10.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Service Name */}
      <h3 className={styles.serviceName}>{name}</h3>

      {/* Price - Three cases:
          1. No price at all (price is 0, null, or undefined) - Don't show price section
          2. Fixed price (price > 0 and price_start_from is false/undefined) - Show price only
          3. Start from price (price > 0 and price_start_from is true) - Show label + price
      */}
      {hasPrice && (
        <div className={styles.servicePrice}>
          {showStartFromLabel && <span className={styles.priceLabel}>{priceLabel}</span>}
          <span className={styles.priceValue}>{formatPrice(price)}</span>
        </div>
      )}
    </div>
  );
}
