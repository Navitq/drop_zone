'use client'
import React from 'react'

import style from '@/styles/homePage.module.scss'
import Bilboard from '@/components/Bilboard'
import { FRONTEND_PATHS } from '@/utilites/urls'
import { useAppSelector } from '@/lib/hooks'
import { useLocale, useTranslations } from 'next-intl'


function AdvertisementBlockMobie(): React.ReactNode {
    const { advertisementItems } = useAppSelector(state => state.advertisement)
    const locale = useLocale()
    const t = useTranslations("homePage")

    if (advertisementItems.length < 2) {
        return null
    }

    return (

        <div className={`${style.abWrapper} ${style.abWrapperRight} ${style.abWrapperMobile}`}>
            <Bilboard linkTo={FRONTEND_PATHS.upgrades} subTitle={advertisementItems[1].subTitle[locale as 'en' | 'ru']} title={advertisementItems[1].title[locale as 'en' | 'ru']} butText={t('to_upgrades')} imgUrl={advertisementItems[1].imgUrl}></Bilboard>
        </div>
    )
}

export default AdvertisementBlockMobie
