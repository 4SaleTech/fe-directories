import { useTranslations } from 'next-intl';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Business Directories</h1>
      <p>مرحباً بك في دليل الأعمال</p>
      <ul>
        <li><a href="/ar/directories">View Directories (Arabic)</a></li>
        <li><a href="/en/directories">View Directories (English)</a></li>
      </ul>
    </div>
  );
}
