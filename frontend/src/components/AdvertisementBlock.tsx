'use client'
import React, { useEffect, useCallback } from 'react'
import style from '@/styles/homePage.module.scss'

import Bilboard from '@/components/Bilboard'
import SmallBilboard from '@/components/SmallBilboard'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useLocale, useTranslations } from 'next-intl'
import { BACKEND_PATHS, FRONTEND_PATHS } from '@/utilites/urls'
import { setAdvertisement } from '@/redux/advertisementReducer'

import api from "@/lib/api";

function AdvertisementBlock(): React.ReactNode {
    const { advertisementItems } = useAppSelector(state => state.advertisement)
    const dispatch = useAppDispatch();
    const locale = useLocale()
    const t = useTranslations("homePage")

    const getAdvertisement = useCallback(async () => {
        try {
            const response = await api.get(BACKEND_PATHS.advertisement);
            dispatch(setAdvertisement(response.data));
        } catch (err) {
            console.log(err);
        }
    }, [dispatch]);

    useEffect(() => {
        getAdvertisement();
    }, [getAdvertisement]);


    if (advertisementItems.length < 2) {
        return null
    }

    return (
        <div className={style.advertisementCnt}>
            <div className={`${style.abWrapper} ${style.abWrapperLeft}`}>
                <Bilboard linkTo={FRONTEND_PATHS.raffles} seconds={advertisementItems[0].timer ? advertisementItems[0].timer : 14000} title={advertisementItems[0].title[locale as 'en' | 'ru']} subTitle={advertisementItems[0].subTitle[locale as 'en' | 'ru']} butText={t('raffles')} classPosition={"bd_left"} imgUrl={advertisementItems[0].imgUrl}></Bilboard>
            </div>
            <div className={`${style.abWrapperSmall}`}>
                <SmallBilboard title={t('events')} subTitle={t("events_is_chance")} btnTitle={t("go_to")}></SmallBilboard>
            </div>
            <div className={`${style.abWrapper} ${style.abWrapperRight}`}>
                <Bilboard linkTo={FRONTEND_PATHS.upgrades} subTitle={advertisementItems[1].subTitle[locale as 'en' | 'ru']} title={advertisementItems[1].title[locale as 'en' | 'ru']} butText={t('to_upgrades')} imgUrl={advertisementItems[1].imgUrl}></Bilboard>
            </div>
        </div>
    )
}

export default AdvertisementBlock
