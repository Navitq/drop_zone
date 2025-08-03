'use client'

import FooterText from '@/components/FooterText'
import { FRONTEND_PATHS } from '@/utilites/urls'

import React, { useMemo } from 'react'
import Link from 'next/link'

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

interface SquareConfig {
    textKey: string,
    sizeClass: string | "fifteen_sz",
    path: string
}


function FooterPageLinks(props: SquareConfig): React.ReactNode {
    const pathname = usePathname()
    console.log('pathname:', pathname)

    const targetPath = useMemo(() => `${FRONTEND_PATHS[`${props.path}`]}`, [props.path])
    const isActive = useMemo(() => pathname === targetPath, [pathname, targetPath])
    const t = useTranslations('homePage');
    console.log(pathname, targetPath)
    return (
        <Link href={targetPath}>
            <FooterText activePage={isActive} text={t(props.textKey)} sizeClass={props.sizeClass}></FooterText>
        </Link>
    )
}

export default React.memo(FooterPageLinks);
