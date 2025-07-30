import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../next-i18next.config';

export default function Home() {
  const { t } = useTranslation(['home']);

  return (
    <div>
      {t('test', { ns: 'home' })}
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home'], nextI18NextConfig)),
    },
  };
}
