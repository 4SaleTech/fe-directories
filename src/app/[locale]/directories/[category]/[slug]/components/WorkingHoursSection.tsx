'use client';

import { useTranslations } from 'next-intl';
import { WorkingHours } from '@/domain/entities/Business';
import styles from './WorkingHoursSection.module.scss';

interface WorkingHoursSectionProps {
  workingHours: WorkingHours[];
  locale: string;
}

const WorkingHoursSection = ({ workingHours, locale }: WorkingHoursSectionProps) => {
  const t = useTranslations('business');

  if (!workingHours || workingHours.length === 0) {
    return null;
  }

  // Days mapping (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  // Sort working hours by day
  const sortedHours = [...workingHours].sort((a, b) => a.day - b.day);

  // Get current day (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();

  const formatTime = (time: string) => {
    // Assuming time is in format "HH:mm:ss" or "HH:mm"
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';

    if (locale === 'ar') {
      // Convert to 12-hour format for Arabic
      const period = hour >= 12 ? 'م' : 'ص';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute} ${period}`;
    } else {
      // Use 12-hour format for English
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute} ${period}`;
    }
  };

  return (
    <section id="working-hours" className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('workingHours')}</h2>
      <div className={styles.hoursTable}>
        {sortedHours.map((hours) => {
          const isToday = hours.day === currentDay;
          const dayName = t(daysOfWeek[hours.day]);

          return (
            <div
              key={hours.id}
              className={`${styles.hourRow} ${isToday ? styles.today : ''}`}
            >
              <div className={styles.dayColumn}>
                <span className={styles.dayName}>{dayName}</span>
                {isToday && <span className={styles.todayBadge}>{t('today')}</span>}
              </div>
              <div className={styles.timeColumn}>
                {hours.is_closed ? (
                  <span className={styles.closedText}>{t('closed')}</span>
                ) : (
                  <span className={styles.timeText}>
                    {formatTime(hours.open_time)} - {formatTime(hours.close_time)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkingHoursSection;
