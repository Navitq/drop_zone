import React from 'react'
import { useTranslations } from 'next-intl'
import style from '@/styles/homePage.module.scss'
import sharedStyles from '@/styles/shared.module.scss'

function TitleHomePage(props: { textKey: string, customStyle?: string }): React.ReactNode {
    const t = useTranslations('homePage');
    return (
        <div className={`${sharedStyles.blockTitle} ${props.customStyle ? style[props.customStyle] : ""}`}>
            {t(props.textKey)}
        </div>
    )
}

export default TitleHomePage
