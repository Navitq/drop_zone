'use client'

import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/lib/hooks'

function CbhPriceInfo(): React.ReactNode {
    const t = useTranslations("battles")
    const { totalCaseAmount, totalPrice } = useAppSelector(state => state.activeBattle)

    function formatNumber(num: number): string {
        return new Intl.NumberFormat('ru-RU').format(num);
    }

    return (
        <div className={style.CbhPriceInfo}>
            <div className={`${style.CbhPriceInfoData} ${style.CbhPriceAndAmount}`}>
                <div>{`${formatNumber(totalPrice)} Dc`}</div>
                <div>{totalCaseAmount}</div>
            </div>
            <div className={style.CbhPriceInfoData}>
                <div>{t('battles_price')}</div>
                <div>{t('rounds_amount')}</div>
            </div>
        </div>
    )
}

export default CbhPriceInfo
