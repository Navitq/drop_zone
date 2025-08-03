import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import '@/styles/global.scss';
import Footer from '@/components/Footer';
import { headBold, headRegular, textRegular } from '@/fonts/fonts'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const fontsClass = [
    headBold.variable,
    headRegular.variable,
    textRegular.variable,
  ].join(' ')

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }



  return (
    <html lang={locale} className={fontsClass}>

      <body>
        <main>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </main>
        <Footer></Footer>
      </body>
    </html>
  );
}
