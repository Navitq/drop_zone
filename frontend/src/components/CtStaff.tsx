'use client'

import React from 'react'

import style from '@/styles/contracts.module.scss'
import { useTranslations } from 'next-intl'

import CtStaffSort from '@/components/CtStaffSort'
import ExClientStuffs from '@/components/ExClientStuffs'
import ShouldAuthStaff from '@/components/ShouldAuthStaff'
import { BACKEND_PATHS, FRONTEND_PATHS } from '@/utilites/urls'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setClientItemData, removeClientItemData } from '@/redux/contractsReducer'
interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function CtStaff(): React.ReactNode {
    const t = useTranslations("contracts")
    const isAuth = useAppSelector(state => state.user.isAuth)
    const client_id = useAppSelector(state => state.user.userData.id)
    const client_items_id = useAppSelector(state => state.contracts.itemClientData)
    const clientItemIds: string[] = client_items_id.map(item => item.id);
    const dispatch = useAppDispatch()

    function activateBtn(value: gunItemModel) {
        dispatch(setClientItemData(value))
    }

    function removeItem(value: gunItemModel) {
        console.log(value.id)
        dispatch(removeClientItemData(value.id))
    }

    return (
        <div className={style.ctStaffCnt}>
            <div className={style.ctStaffTxtCnt}>
                <div className={style.ctStaffTitle}>{t('accessible_objects')}</div>
                <div className={style.ctStaffSortCnt}>
                    <CtStaffSort></CtStaffSort>
                </div>
            </div>
            <div className={style.sasContracts}>
                {isAuth ? (
                    <ExClientStuffs removeItem={(value) => { removeItem(value) }} deleteTxt={t('remove_item')} client_id={clientItemIds} activateBtn={(value) => { activateBtn(value) }} body={{ limit: 25, client_id }} btnText={t('go_to_case')} titleText={t('open_return')} linkTo={FRONTEND_PATHS.home} targetUrl={BACKEND_PATHS.getInventoryStaff} ></ExClientStuffs>) : (
                    <ShouldAuthStaff btnText={t('auth_upgrade')} titleText={t('unauth_upgrade_sub_title')}></ShouldAuthStaff>
                )}
            </div>
        </div>
    )
}

export default CtStaff
