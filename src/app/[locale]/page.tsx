import { redirect } from 'next/navigation';

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  redirect(`/${locale}/directories`);
}
