'use client'
import React from 'react'
import style from '@/styles/modal.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/lib/hooks'

function RafflesModalWrapped(props: { close: () => void }) {
    const t = useTranslations("header")
    const { title, sub_title } = useAppSelector(state => state.modal.rafflesModal)

    return (
        <div className={style.nmmwCnt} onClick={(e) => { e.stopPropagation() }}>
            <div className={style.pmwHeaderBlock}>
                <div className={style.pmwTitleBlock}>
                    <div className={style.pmwTitle}>{title}</div>
                </div>
                <div className={style.nmmwSeparatorCnt}>
                    {/* <Image alt={t('divider_alt')} src={"/images/payment_divider.svg"} width={403} height={1}></Image> */}
                </div>
                <div className={style.nmmwText}>
                    {sub_title}
                </div>
            </div>

            <div className={style.nmmwBtnCnt}>
                <CaseBtnText text={t("status_ok")} onClick={() => { props.close() }}></CaseBtnText>
            </div>
        </div>
    )
}

export default RafflesModalWrapped
