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
import ShouldAuthStaff from '@/components/ShouldAuthStaff'

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
    const server_item = useAppSelector(state => state.upgrade.itemServerData.id)
    const isAuth = useAppSelector(state => state.user.isAuth)
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
            {isAuth ? <ExClientStuffs titleText={t('wait_for_items')} btnText={t('go_to_case')} server_id={server_item} body={{ limit: 25, startPrice: price * priceСoefficient }} activateBtn={(value: gunItemModel) => { activateBtn(value) }} targetUrl={BACKEND_PATHS.getServerInventoryStaff}></ExClientStuffs> : (
                <ShouldAuthStaff btnText={t('auth_upgrade')} subTitleText={t('unauth_upgrade_sub_title')} titleText={t('unauth_upgrade')}></ShouldAuthStaff>
            )}
        </div>
    )
}

export default ExchangeServerPropierty
