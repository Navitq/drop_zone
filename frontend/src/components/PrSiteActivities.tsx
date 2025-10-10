import React from 'react'

import style from '@/styles/profile.module.scss'

import PrActivity from '@/components/PrActivity'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/lib/hooks'


function PrSiteActivities(): React.ReactNode {
    const t = useTranslations('profile')
    const stats = useAppSelector(state => state.profile.stats)
    return (
        <div className={style.prSiteActivities}>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_luggage.svg"} activityName={t("prof_contracts")} activityAmount={stats.total_contracts ? stats.total_contracts : 0}></PrActivity>
            </div>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_shooting.svg"} activityName={t("prof_battles")} activityAmount={stats.total_battles ? stats.total_battles : 0}></PrActivity>
            </div>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_key.svg"} activityName={t("prof_cases")} activityAmount={stats.total_case_opened ? stats.total_case_opened : 0}></PrActivity>
            </div>
            <div className={style.prActivityCnt}>
                <PrActivity activityPath={"/images/profile_arrow.svg"} activityName={t("prof_upgrades")} activityAmount={stats.total_upgrades ? stats.total_upgrades : 0}></PrActivity>
            </div>
        </div>
    )
}

export default PrSiteActivities
