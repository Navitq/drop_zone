import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import '@/styles/global.scss';
import Footer from '@/components/Footer';
import { headBold, headRegular, textRegular, textBold } from '@/fonts/fonts'
import Header from '@/components/Header';

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
    textBold.variable
  ].join(' ')

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }


  return (
    <html lang={locale} className={fontsClass}>

      <body>
        <div className='global-container'>
          <NextIntlClientProvider>
            <Header></Header>
            <main className='global-content'>
              {children}
            </main>
            <Footer></Footer>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
