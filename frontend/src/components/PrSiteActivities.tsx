import React from 'react'

import style from '@/styles/profile.module.scss'

import PrActivity from '@/components/PrActivity'
import { useTranslations } from 'next-intl'


function PrSiteActivities(): React.ReactNode {
    const t = useTranslations('profile')
    return (
        <div className={style.prSiteActivities}>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_luggage.svg"} activityName={t("prof_contracts")} activityAmount={1564}></PrActivity>
            </div>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_shooting.svg"} activityName={t("prof_battles")} activityAmount={1564}></PrActivity>
            </div>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_key.svg"} activityName={t("prof_cases")} activityAmount={4444442131}></PrActivity>
            </div>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_arrow.svg"} activityName={t("prof_upgrades")} activityAmount={1564}></PrActivity>
            </div>
        </div>
    )
}

export default PrSiteActivities
