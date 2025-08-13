import { useTranslations } from 'next-intl'
import React from 'react'


import style from '@/styles/upgrades.module.scss'

function ExchangeTitle(props: { titleKey: string }) {
    const t = useTranslations("upgrades")
    return (
        <div className={style.exchangeTitle}>
            {t(props.titleKey)}
        </div>
    )
}

export default ExchangeTitle
