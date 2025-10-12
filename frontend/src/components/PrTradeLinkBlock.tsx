'use client'

import React, { useState } from 'react'

import style from '@/styles/profile.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { useTranslations } from 'next-intl'
import { showNoMoneyModal, showUnAuthModal, showRafflesStateModal } from '@/redux/modalReducer'
import { AxiosError } from "axios";

import { BACKEND_PATHS } from '@/utilites/urls'

import api from "@/lib/api";
import { useAppDispatch } from '@/lib/hooks'

function PrTradeLinkBlock(): React.ReactNode {
    const t = useTranslations('profile')
    const [link, setLink] = useState<string>('')
    const dispatch = useAppDispatch()

    function sanitizeLink(value: string) {
        return value.replace(/[^A-Za-z0-9/:.?=&_%\-]/g, '')
    }

    function textCahnge(e: React.ChangeEvent<HTMLInputElement>) {
        setLink(sanitizeLink(e.currentTarget.value))
    }

    async function saveTradeLink() {
        try {
            await api.post(BACKEND_PATHS.setTradeLink, {
                tradeLink: link
            });
            dispatch(showRafflesStateModal({ title: t("success"), sub_title: `${t("successfully_added")}` }))
            setLink("")
        } catch (err) {
            const error = err as AxiosError;
            console.log(error.status)
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 402) {
                dispatch(showNoMoneyModal())
            } else if (error.response?.status === 409) {
                dispatch(showRafflesStateModal({ title: t("err"), sub_title: t("err_bad_link") }))
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    return (
        <div className={style.prTradeLinkBlock}>
            <div className={style.prTradeInputCnt}>
                <input maxLength={200} className={style.prTradeInput} onChange={(e) => { textCahnge(e) }} value={link} type="text" placeholder={t('type_trade_link')} />
            </div>
            <div className={style.prSaveBtCnt}>
                <CaseBtnText text={t('save_trade')} onClick={() => { saveTradeLink() }}></CaseBtnText>
            </div>
        </div >
    )
}

export default PrTradeLinkBlock
