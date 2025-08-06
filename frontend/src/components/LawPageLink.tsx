'use client'

import React from 'react'
import styles from '@/public/styles/basement.module.scss'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function LawPageLink(props: { textKey: string, path: string, styleClass: string }): React.ReactNode {
    const t = useTranslations('homePage')
    return (
        <div className={styles.lawLinksCnt}>
            <Link href={`${props.path}`} className={styles.lawLinks}>{t(props.textKey)}</Link>
        </div>
    )
}

export default LawPageLink
