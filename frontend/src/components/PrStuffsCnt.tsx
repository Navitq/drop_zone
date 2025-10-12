'use client'
import React from 'react'

import style from '@/styles/profile.module.scss'

import PrOwnerStaffHeader from '@/components/PrOwnerStaffHeader'
import PrUserStaffHeader from '@/components/PrUserStaffHeader'
import ExClientStuffs from '@/components/ExClientStuffs'
import { useTranslations } from 'next-intl'
import { BACKEND_PATHS } from '@/utilites/urls'
import { setAmountAndPriseItems } from '@/redux/profileReducer'
import { useAppDispatch } from '@/lib/hooks'

interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function PrStuffsCnt(props: { client_id: string, ownerId: string }): React.ReactNode {
    const t = useTranslations("upgrades")
    const dispatch = useAppDispatch()
    function itemPriceAndAmount(items: gunItemModel[]) {
        console.log(items, 454545)
        const totalItems = items.length
        const totalPrice = items.reduce((acc, item) => acc + Number(item.gunPrice), 0)
        dispatch(setAmountAndPriseItems({ totalItems, totalPrice: Number(totalPrice.toFixed(2)) }))
    }

    function activateBtn(item: gunItemModel) {
        console.log(item)
    }

    function getItemFromServer(item: gunItemModel) {
        console.log(item)
    }

    return (
        <div className={`${style.prStuffsCnt} prStuffsCnt`}>
            {props.client_id === props.ownerId && props.ownerId != undefined ? <PrOwnerStaffHeader></PrOwnerStaffHeader> : <PrUserStaffHeader ></PrUserStaffHeader>}
            <ExClientStuffs itemPriceAndAmount={(items) => { itemPriceAndAmount(items) }} activeBtlText={t('sell_good')} isActiveProfile={true} titleText={t("open_return")} removeItem={(item) => { getItemFromServer(item) }} btnText={t("go_to_case")} deleteTxt={t('get_item')} activateBtn={(value) => { activateBtn(value) }} targetUrl={BACKEND_PATHS.getInventoryStaff} body={{ client_id: props.client_id, limit: 25 }}></ExClientStuffs>
        </div>
    )
}

export default PrStuffsCnt
