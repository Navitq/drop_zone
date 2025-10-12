import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'
import PrStaffTitle from '@/components/PrStaffTitle'
import { useAppSelector } from '@/lib/hooks'




function PrUserStaffHeader(): React.ReactNode {
    const t = useTranslations("profile")
    const totalItems = useAppSelector(state => state.profile.totalItems)
    const totalPrice = useAppSelector(state => state.profile.totalPrice)
    return (
        <div className={`${style.prUserStaffHeader} ${style.notUser}`}>
            <div className={style.prOwnerStaffTitle}>
                <PrStaffTitle text={t('user_objects')}></PrStaffTitle>
            </div>
            <div className={style.prStuffCntInfo}>
                <div className={style.prStuffAmount}>{`${t('objects_amount')} ${totalItems}`}</div>
                <div className={style.prStuffTotalPrice}>{`${t('total_objects_price')} ${totalPrice} Dc`}</div>
            </div>
        </div>
    )
}

export default PrUserStaffHeader
