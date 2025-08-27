import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'

import PrStaffTitle from '@/components/PrStaffTitle'
import CtStaffSort from '@/components/CtStaffSort'
import CaseBtnText from '@/components/CaseBtnText'


interface PrOwnerStaffHeaderInt {
    amount: number,
    price: number
}

function PrOwnerStaffHeader(props: PrOwnerStaffHeaderInt): React.ReactNode {
    const t = useTranslations("profile")

    return (
        <div className={style.prOwnerStaffHeader}>
            <div className={style.prOwnerStaffTitle}>
                <PrStaffTitle text={t('your_objects')}></PrStaffTitle>
            </div>
            <div className={style.prSettingsData}>
                <div className={style.prSortStuffBlock}>
                    <CtStaffSort></CtStaffSort>
                    <div className={`${style.prSaveBtCnt}  ${style.prMgLThrty}`}>
                        <CaseBtnText text={t('sell_all')}></CaseBtnText>
                    </div>
                </div>
                <div className={style.prStuffCntInfo}>
                    <div className={style.prStuffAmount}>{`${t('objects_amount')} ${props.amount}`}</div>
                    <div className={style.prStuffTotalPrice}>{`${t('total_objects_price')} ${props.price} Dc`}</div>
                </div>
            </div>
        </div>
    )
}

export default PrOwnerStaffHeader
