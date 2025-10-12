'use client'

import React, { useState, useRef } from 'react'

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
    const saveTimer = useRef<NodeJS.Timeout | null>(null)

    function sanitizeLink(value: string) {
        return value.replace(/[^A-Za-z0-9/:.?=&_%\-]/g, '')
    }

    function textCahnge(e: React.ChangeEvent<HTMLInputElement>) {
        setLink(sanitizeLink(e.currentTarget.value))
    }

    async function saveTradeLink() {
        // Очистить предыдущий таймер (если пользователь нажимает снова)
        if (saveTimer.current) clearTimeout(saveTimer.current)

        // Устанавливаем новый
        saveTimer.current = setTimeout(async () => {
            try {
                await api.post(BACKEND_PATHS.setTradeLink, {
                    tradeLink: link,
                })
                dispatch(showRafflesStateModal({ title: t('success'), sub_title: t('successfully_added') }))
                setLink('')
            } catch (err) {
                const error = err as AxiosError
                const status = error.response?.status

                if (status === 401) {
                    dispatch(showUnAuthModal())
                } else if (status === 402) {
                    dispatch(showNoMoneyModal())
                } else if (status === 409) {
                    dispatch(showRafflesStateModal({ title: t('err'), sub_title: t('err_bad_link') }))
                } else {
                    console.error('Неизвестная ошибка', error)
                }
            }
        }, 1000) // ⏱ задержка 1 секунда после последнего нажатия
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
