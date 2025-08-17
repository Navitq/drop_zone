import React from 'react'

import ExBlockTitle from '@/components/ExBlockTitle'
import { useTranslations } from 'next-intl'

import style from '@/styles/upgrades.module.scss'

function ExClientPropierty(): React.ReactNode {
    const t = useTranslations("upgrades")
    return (
        <div className={style.exClientCnt}>
            <div>
                <ExBlockTitle title={t('your_skins')}></ExBlockTitle>
                So
            </div>
        </div>
    )
}

export default ExClientPropierty
