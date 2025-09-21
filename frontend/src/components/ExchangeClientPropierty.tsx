'use client'
import React from 'react'

import style from '@/styles/upgrades.module.scss'

import ExClientPropierty from '@/components/ExClientPropierty'
import ExClientStuffs from '@/components/ExClientStuffs'
import { BACKEND_PATHS } from '@/utilites/urls'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setItemToUpgrade } from '@/redux/upgradeReducer'

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
    const dispatch = useAppDispatch()


    function activateBtn(value: gunItemModel) {
        dispatch(setItemToUpgrade(value))
    }

    return (
        <div className={style.clientBlock}>
            <ExClientPropierty></ExClientPropierty>
            <ExClientStuffs  addPrize={upgradeFinished} activateBtn={(value) => { activateBtn(value) }} targetUrl={BACKEND_PATHS.getInventoryStaff} body={{ client_id, limit: 25 }}></ExClientStuffs>
        </div>
    )
}

export default ExchangeClientPropierty
