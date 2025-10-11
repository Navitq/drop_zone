import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'
import PrStaffTitle from '@/components/PrStaffTitle'

interface PrUserStaffHeaderInt {
    amount: number,
    price: number
}

function PrUserStaffHeader(props: PrUserStaffHeaderInt): React.ReactNode {
    const t = useTranslations("profile")
    return (
        <div className={`${style.prUserStaffHeader} ${style.notUser}`}>
            <div className={style.prOwnerStaffTitle}>
                <PrStaffTitle text={t('user_objects')}></PrStaffTitle>
            </div>
            <div className={style.prStuffCntInfo}>
                <div className={style.prStuffAmount}>{`${t('objects_amount')} ${props.amount}`}</div>
                <div className={style.prStuffTotalPrice}>{`${t('total_objects_price')} ${props.price} Dc`}</div>
            </div>
        </div>
    )
}

export default PrUserStaffHeader
