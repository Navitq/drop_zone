'use client'
import React from 'react'
import CaseBtnText from '@/components/CaseBtnText'
import style from '@/styles/contracts.module.scss'
import CtSkinPriceBlock from '@/components/CtSkinPriceBlock'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { useTranslations } from 'next-intl'
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'
import { setWonItem } from '@/redux/contractsReducer'
import { AxiosError } from "axios";

import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

function MakeContractsMobile(): React.ReactNode {
    const t = useTranslations("contracts")
    const dispatch = useAppDispatch()

    function roundToPowerOfTen(num: number, powerOfTen: number): number {
        return Math.round(num * 10 ** powerOfTen) / 10 ** powerOfTen;
    }

    async function makeContract() {
        try {
            const response = await api.post(BACKEND_PATHS.makeContract, { itemClientData: items });
            console.log(response.data.items)
            dispatch(setWonItem(response.data.items))
        } catch (err) {
            const error = err as AxiosError;
            console.log(error.status)
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 402) {
                dispatch(showNoMoneyModal())
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    const items = useAppSelector(state => state.contracts.itemClientData)
    const totalItemsPrice = items.reduce((sum, item) => Number(sum) + Number(item.gunPrice), 0)
    const totalAmount = useAppSelector(state => state.contracts.itemClientData.length)
    return (
        <div className={`${style.mcmMobileCnt} ${style.pcMobilePage}`}>
            <div className={style.mcmMobilePriceBlock}>
                <CtSkinPriceBlock text={t('your_skin_price')} price={`${totalItemsPrice ? totalItemsPrice : 0}`}></CtSkinPriceBlock>

                <CtSkinPriceBlock text={t('our_skins_assessment')} price={`${(roundToPowerOfTen((totalItemsPrice ? totalItemsPrice : 0) / 4, 2)).toFixed(2)} - ${(roundToPowerOfTen((totalItemsPrice ? totalItemsPrice : 0) * 4, 2)).toFixed(2)}`}></CtSkinPriceBlock>
            </div>
            {
                totalAmount < 3 ? (
                    <div className={style.objectAmountCnt}>
                        <div className={style.objectAmount}>{t('objects_amount')}</div>
                    </div>
                ) : (

                    <div className={style.objectAmountCntBtn}>
                        <CaseBtnText text={t('open')} onClick={() => { makeContract() }}></CaseBtnText>
                    </div>

                )
            }
        </div>
    )
}

export default MakeContractsMobile
