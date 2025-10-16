'use client'
import React, { useRef, useState } from 'react'

import style from '@/styles/profile.module.scss'

import PrOwnerStaffHeader from '@/components/PrOwnerStaffHeader'
import PrUserStaffHeader from '@/components/PrUserStaffHeader'
import ExClientStuffs from '@/components/ExClientStuffs'
import { useTranslations } from 'next-intl'
import { BACKEND_PATHS } from '@/utilites/urls'
import { setAmountAndPriseItems } from '@/redux/profileReducer'
import { useAppDispatch } from '@/lib/hooks'
import { showUnAuthModal } from '@/redux/modalReducer'
import { setUserMoney } from '@/redux/userReducer'
import { AxiosError } from "axios";
import { showRafflesStateModal } from '@/redux/modalReducer'

import api from "@/lib/api";

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
    const t_prof = useTranslations("profile")
    const dispatch = useAppDispatch()
    const [detetedItems, setDeletedItems] = useState<string[]>([])
    const isRemoveActiveRef = useRef<boolean>(false)
    const isGetSteamActiveRef = useRef<boolean>(false)
    const [sortType, setSortType] = useState<number>(1)

    function itemPriceAndAmount(items: gunItemModel[]) {
        const totalItems = items.length
        const totalPrice = items.reduce((acc, item) => acc + Number(item.gunPrice), 0)
        dispatch(setAmountAndPriseItems({ totalItems, totalPrice: Number(totalPrice.toFixed(2)) }))
    }

    async function activateBtn(item: gunItemModel) {
        if (isGetSteamActiveRef.current) {
            return
        }
        try {
            isGetSteamActiveRef.current = true
            const response = await api.post(BACKEND_PATHS.makeBooking, {
                itemId: item.id
            });
            isGetSteamActiveRef.current = false
            dispatch(showRafflesStateModal({ title: t_prof("success"), sub_title: `${t_prof("success_order_created")} ${response.data.order_id}` }))
            setDeletedItems(() => [item.id])
        } catch (err) {
            const error = err as AxiosError;
            isGetSteamActiveRef.current = false
            if (error.response?.status === 415) {
                dispatch(showRafflesStateModal({ title: t_prof("err"), sub_title: `${t_prof("trade_error_text")}` }))
            } else if (error.response?.status === 416) {
                dispatch(showRafflesStateModal({ title: t_prof("err"), sub_title: `${t_prof("marketable_error_text")}` }))
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    const changeFunc = (value: string) => {
        setSortType(Number(value))
    }

    async function sellItem(item: gunItemModel) {
        if (isRemoveActiveRef.current) {
            return
        }
        try {
            isRemoveActiveRef.current = true
            const response = await api.post(BACKEND_PATHS.sellItem, {
                itemId: item.id
            });
            dispatch(setUserMoney(response.data.new_balance))
            isRemoveActiveRef.current = false
            setDeletedItems(() => [item.id])
        } catch (err) {
            const error = err as AxiosError;
            isRemoveActiveRef.current = false
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 416) {
                dispatch(showRafflesStateModal({ title: t_prof("err"), sub_title: `${t_prof("marketable_error_text")}` }))
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    return (
        <div className={`${style.prStuffsCnt} prStuffsCnt`}>
            {props.client_id === props.ownerId && props.ownerId != undefined ? <PrOwnerStaffHeader changeFunc={(value: string) => { changeFunc(value) }}></PrOwnerStaffHeader> : <PrUserStaffHeader ></PrUserStaffHeader>}
            <ExClientStuffs sortType={sortType} profileDeletedItems={detetedItems[0]} deleteProfileItem={detetedItems} itemPriceAndAmount={(items) => { itemPriceAndAmount(items) }} activeBtlText={t('sell_good')} isActiveProfile={props.client_id === props.ownerId} titleText={t("open_return")} removeItem={(value) => { activateBtn(value) }} btnText={t("go_to_case")} deleteTxt={t('get_item')} activateBtn={(value) => { sellItem(value) }} targetUrl={BACKEND_PATHS.getInventoryStaff} body={{ client_id: props.client_id, limit: 25 }}></ExClientStuffs>
        </div>
    )
}

export default PrStuffsCnt
