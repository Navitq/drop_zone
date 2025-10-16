import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'

import PrStaffTitle from '@/components/PrStaffTitle'
import CtStaffSort from '@/components/CtStaffSort'
import CaseBtnText from '@/components/CaseBtnText'
import { useAppSelector } from '@/lib/hooks'




function PrOwnerStaffHeader(props: { changeFunc: (value: string) => void, }): React.ReactNode {
    const t = useTranslations("profile")
    const totalItems = useAppSelector(state => state.profile.totalItems)
    const totalPrice = useAppSelector(state => state.profile.totalPrice)

    return (
        <div className={`${style.prOwnerStaffHeader} ${style.prOwnerDataTopHead}`}>
            <div className={`${style.prOwnerStaffTitle} ${style.prOwnerStaffTitleMobile}`}>
                <PrStaffTitle text={t('your_objects')}></PrStaffTitle>
                <div className={`${style.prSaveBtCnt}  ${style.prMgLThrty} ${style.prMgLThrtyMobile}`}>
                    <CaseBtnText text={t('sell_all')}></CaseBtnText>
                </div>
            </div>
            <div className={style.prSettingsData}>
                <div className={style.prSortStuffBlock}>
                    <CtStaffSort changeFunc={(value: string) => props.changeFunc(value)}></CtStaffSort>
                    <div className={`${style.prSaveBtCnt}  ${style.prMgLThrty} ${style.prMgLThrtyPc}`}>
                        <CaseBtnText text={t('sell_all')}></CaseBtnText>
                    </div>
                </div>
                <div className={style.prStuffCntInfo}>
                    <div className={style.prStuffAmount}>{`${t('objects_amount')} ${totalItems}`}</div>
                    <div className={style.prStuffTotalPrice}>{`${t('total_objects_price')} ${totalPrice} Dc`}</div>
                </div>
            </div>
        </div>
    )
}

export default PrOwnerStaffHeader
