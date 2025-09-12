'use client'
import React from 'react'
import style from '@/styles/modal.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/lib/hooks'
import { showPaymentModal } from '@/redux/modalReducer'
import Image from 'next/image'

function NoMoneyModalWrapped(props: { close: () => void }) {
    const t = useTranslations("header")
    const dispatch = useAppDispatch()

    function openPaymentModal() {
        props.close()
        dispatch(showPaymentModal())
    }

    return (
        <div className={style.nmmwCnt} onClick={(e) => { e.stopPropagation() }}>
            <div className={style.pmwHeaderBlock}>
                <div className={style.pmwTitleBlock}>
                    <div className={style.pmwTitle}>{t('no_money')}</div>
                    <div className={style.pmwExchangeRate}>
                        {`${"1"} Dc ≈ ${"1"}`}
                    </div>
                </div>
                <div className={style.nmmwSeparatorCnt}>
                    {/* <Image alt={t('divider_alt')} src={"/images/payment_divider.svg"} width={403} height={1}></Image> */}
                </div>
                <div className={style.nmmwText}>
                    {t('no_money_no_case')}
                </div>
            </div>

            <div className={style.nmmwBtnCnt}>
                <CaseBtnText text={t("top_up")} onClick={() => { openPaymentModal() }}></CaseBtnText>
            </div>
        </div>
    )
}

export default NoMoneyModalWrapped
