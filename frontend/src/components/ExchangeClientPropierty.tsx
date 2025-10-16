'use client'
import React, { useState } from 'react'

import style from '@/styles/upgrades.module.scss'

import ExClientPropierty from '@/components/ExClientPropierty'
import ExClientStuffs from '@/components/ExClientStuffs'
import { BACKEND_PATHS, FRONTEND_PATHS } from '@/utilites/urls'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setItemToUpgrade } from '@/redux/upgradeReducer'
import ShouldAuthStaff from '@/components/ShouldAuthStaff'
import { useTranslations } from 'next-intl'
import { removeFinishedItem } from '@/redux/upgradeReducer'

interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function ExchangeClientPropierty(): React.ReactNode {
    const client_id = useAppSelector(state => state.user.userData.id)
    const upgradeFinished = useAppSelector(state => state.upgrade.upgradeFinished)
    const client_item = useAppSelector(state => state.upgrade.itemData.id)
    const isAuth = useAppSelector(state => state.user.isAuth)
    const [sortType, setSortType] = useState<number>(1)
    const dispatch = useAppDispatch()
    const t = useTranslations("upgrades")

    function activateBtn(value: gunItemModel) {
        if (!isAuth) {
            return;
        }
        dispatch(setItemToUpgrade(value))
    }

    function changeFunc(value: string) {
        if (!isAuth) {
            return;
        }
        dispatch(removeFinishedItem())
        setSortType(Number(value))
    }

    return (
        // <div className={style.clientBlockMain}>
        <div className={style.clientBlock}>
            <ExClientPropierty changeFunc={(value: string) => { changeFunc(value) }}></ExClientPropierty>
            {
                isAuth ? <ExClientStuffs sortType={sortType} linkTo={FRONTEND_PATHS.home} titleText={t("open_return")} btnText={t("go_to_case")} client_id={client_item} addPrize={upgradeFinished} activateBtn={(value) => { activateBtn(value) }} targetUrl={BACKEND_PATHS.getInventoryStaff} body={{ client_id, limit: 25 }}></ExClientStuffs> : (
                    <ShouldAuthStaff btnText={t('auth_upgrade')} subTitleText={t('unauth_upgrade_sub_title')} titleText={t('unauth_upgrade')}></ShouldAuthStaff>
                )
            }
        </div >
        // </div>
    )
}

export default ExchangeClientPropierty
