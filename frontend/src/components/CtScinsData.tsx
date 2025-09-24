'use client'

import React from 'react'
import style from '@/styles/contracts.module.scss'
import { useTranslations } from 'next-intl'
import { AxiosError } from "axios";

import CtSkinPriceBlock from '@/components/CtSkinPriceBlock'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CaseBtnText from '@/components/CaseBtnText'
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'

import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

function CtScinsData(props: { scinPrice?: number }): React.ReactNode {
    const t = useTranslations("contracts")
    const dispatch = useAppDispatch()
    const items = useAppSelector(state => state.contracts.itemClientData)
    const totalItemsPrice = items.reduce((sum, item) => sum + item.gunPrice, 0)
    const totalAmount = useAppSelector(state => state.contracts.itemClientData.length)

    function roundToPowerOfTen(num: number, powerOfTen: number): number {
        return Math.round(num * 10 ** powerOfTen) / 10 ** powerOfTen;
    }

    async function makeContract() {
        try {

            const response = await api.post(BACKEND_PATHS.makeContract, { itemClientData: items });
            console.log(response.data)
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

    return (
        <div className={style.ctScinsData}>
            <div className={style.userInfo}>
                <CtSkinPriceBlock text={t('your_skin_price')} price={`${totalItemsPrice ? totalItemsPrice : 0}`}></CtSkinPriceBlock>

                <CtSkinPriceBlock text={t('our_skins_assessment')} price={`${props.scinPrice ? `${(roundToPowerOfTen((totalItemsPrice ? totalItemsPrice : 0) / 4, 2)).toFixed(2)} - ${(roundToPowerOfTen((totalItemsPrice ? totalItemsPrice : 0) * 4, 2)).toFixed(2)}` : "0.00 - 0.00"}`}></CtSkinPriceBlock>
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
            <div className={style.ctRulesCnt}>
                <div className={style.ctRulesTitle}>{t('how_its_work')}</div>
                <ul className={style.RulesList}>
                    <li>{t('rule_point_one')}</li>
                    <li>{t('rule_point_two')}</li>
                    <li>{t('rule_point_tree')}</li>
                </ul>
            </div>
        </div>
    )
}

export default CtScinsData
