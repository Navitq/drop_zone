// app/not-found.tsx
import LocaleLayout from './[locale]/layout';
import Error404 from '@/components/Error404';

export default function GlobalNotFound() {
    const locale = 'ru'; // fallback для всех страниц

    return (
        <LocaleLayout params={Promise.resolve({ locale })}>
            <Error404></Error404>
        </LocaleLayout>
    );
}
