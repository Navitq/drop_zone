import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import '@/styles/global.scss';
import Footer from '@/components/Footer';
import { headBold, headRegular, textRegular, textBold } from '@/fonts/fonts'
import Header from '@/components/Header';
import BackGround from '@/components/BackGround';
import { cookies } from 'next/headers'
import StoreProvider from '@/app/StoreProvider'
import { getUser } from '@/lib/getUser';
import RafflesModal from '@/components/RafflesModal';
import WonInventoryBlock from '@/components/WonInventoryBlock'

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


  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll(); // массив всех кук

  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ");

  const user = await getUser(cookieHeader)
  const preloadedState = user ? { userData: user, isAuth: true, isLoading: false } : {}

  return (
    <html lang={locale} className={fontsClass}>

      <body>
        <StoreProvider preloadedState={preloadedState}>
          <div className='global-container'>
            <NextIntlClientProvider>
              <WonInventoryBlock></WonInventoryBlock>
              <BackGround></BackGround>
              <Header></Header>
              <main className='global-content'>
                {children}
              </main>
              <Footer></Footer>
              <RafflesModal ></RafflesModal>
            </NextIntlClientProvider>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
