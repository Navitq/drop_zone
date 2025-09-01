'useClient'

import React from 'react'
import { routing } from '@/i18n/routing';

import style from '@/styles/header.module.scss'
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';


function UserModalLanguageSettings() {
    const currentLocale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();

    function changeLocale(localeCurent: string): void {
        router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale: localeCurent }
        );
    }


    function capitalizeFirstLetter(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <div className={style.umlsCnt}>
            {routing.locales.map((locale) => (
                <div onClick={() => { changeLocale(locale) }} key={locale} className={locale == currentLocale ? `${style.activeLocale} ${style.passiveLocale}` : `${style.passiveLocale}`}>
                    <span>{capitalizeFirstLetter(locale)}</span>
                </div>
            ))}
        </div>
    )
}

export default UserModalLanguageSettings
