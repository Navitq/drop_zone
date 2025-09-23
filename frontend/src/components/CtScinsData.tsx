'use client'

import React from 'react'
import style from '@/styles/contracts.module.scss'
import { useTranslations } from 'next-intl'

import CtSkinPriceBlock from '@/components/CtSkinPriceBlock'
import { useAppSelector } from '@/lib/hooks'
import CaseBtnText from '@/components/CaseBtnText'

function CtScinsData(props: { scinPrice?: number }): React.ReactNode {
    const t = useTranslations("contracts")
    const items = useAppSelector(state => state.contracts.itemClientData)
    const totalItemsPrice = items.reduce((sum, item) => sum + item.gunPrice, 0)
    const totalAmount = useAppSelector(state => state.contracts.itemClientData.length)

    function roundToPowerOfTen(num: number, powerOfTen: number): number {
        return Math.round(num * 10 ** powerOfTen) / 10 ** powerOfTen;
    }

    function makeContract() {
        return;
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
