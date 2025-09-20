'use client'
import React from 'react'

import style from '@/styles/upgrades.module.scss'
import { useTranslations } from 'next-intl'

import ExBlockTitle from '@/components/ExBlockTitle'
import SearchEx from '@/components/SearchEx'
import SearchByPrice from '@/components/SearchByPrice'
import ExClientStuffs from '@/components/ExClientStuffs'
import { BACKEND_PATHS } from '@/utilites/urls'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setServerItemToUpgrade } from '@/redux/upgradeReducer'

interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function ExchangeServerPropierty(): React.ReactNode {
    const t = useTranslations('upgrades')
    const dispatch = useAppDispatch()

    const price = useAppSelector(state => state.upgrade.price)
    const priceСoefficient = useAppSelector(state => state.upgrade.priceСoefficient)
    function activateBtn(value: gunItemModel) {
        dispatch(setServerItemToUpgrade(value))
    }

    return (
        <div className={style.clientBlock}>
            <div className={style.serverInfoBlock}>
                <div className={style.serverExTitle}>
                    <ExBlockTitle title={t('get_our_skins')}></ExBlockTitle>
                </div>
                <div className={style.exServerSearch}>
                    <SearchEx placeHolderText={t('search_by_data')}></SearchEx>
                    <SearchByPrice placeHolderText={t('search_by_price')}></SearchByPrice>
                </div>
            </div>
            <ExClientStuffs body={{ limit: 5, startPrice: price * priceСoefficient }} activateBtn={(value: gunItemModel) => { activateBtn(value) }} targetUrl={BACKEND_PATHS.getServerInventoryStaff}></ExClientStuffs>
        </div>
    )
}

export default ExchangeServerPropierty
