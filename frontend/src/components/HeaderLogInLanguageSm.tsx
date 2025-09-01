'use client';
import React from 'react';
import { useLocale } from 'next-intl';
import style from '@/styles/header.module.scss';
import { routing } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

function HeaderLogInLanguageSm() {
    const currentLocale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();

    function changeLocale(localeCurent: string): void {
        router.replace(
            // @ts-expect-error -- TypeScript проверяет params вместе с pathname
            { pathname, params },
            { locale: localeCurent }
        );
    }

    function capitalizeFirstLetter(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div>
            {routing.locales
                .filter(locale => locale !== currentLocale)
                .map(locale => (
                    <div
                        onClick={() => changeLocale(locale)}
                        key={locale}
                        className={`${style.logInLocale}`}
                    >
                        <span>{capitalizeFirstLetter(locale)}</span>
                    </div>
                ))}
        </div>
    );
}

export default HeaderLogInLanguageSm;
