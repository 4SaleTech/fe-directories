'use client';

import { useState, useEffect } from 'react';
import { ForSaleService } from '@/domain/entities/ForSale';
import { businessRepository } from '@/infrastructure/repositories/BusinessRepository';
import ServicesSection from './ServicesSection';
import styles from './TabContent.module.scss';

interface ServicesTabContentProps {
  businessSlug: string;
  locale: string;
}

export default function ServicesTabContent({ businessSlug, locale }: ServicesTabContentProps) {
  const [services, setServices] = useState<ForSaleService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await businessRepository.getServices(businessSlug, locale);
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(locale === 'ar' ? 'فشل في تحميل الخدمات' : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [businessSlug, locale]);

  if (loading) {
    return (
      <div className={styles.emptyState}>
        <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      {services && services.length > 0 ? (
        <ServicesSection services={services} locale={locale} />
      ) : (
        <div className={styles.emptyState}>
          <p>{locale === 'ar' ? 'لا توجد خدمات متاحة' : 'No services available'}</p>
        </div>
      )}
    </div>
  );
}
