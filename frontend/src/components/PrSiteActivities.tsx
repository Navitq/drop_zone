import React from 'react'

import style from '@/styles/profile.module.scss'

import PrActivity from '@/components/PrActivity'
import { useTranslations } from 'next-intl'


function PrSiteActivities(): React.ReactNode {
    const t = useTranslations()
    return (
        <div className={style.prSiteActivities}>
            <PrActivity></PrActivity>
        </div>
    )
}

export default PrSiteActivities
