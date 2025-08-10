import React from 'react'
import style from '@/styles/cases.module.scss'
import { useTranslations } from 'next-intl'

export default function CaseName(props: { caseName: string }): React.ReactNode {
    const t = useTranslations("cases");
    return (
        <div className={style.caseName}>{t(props.caseName)}</div>
    )
}
