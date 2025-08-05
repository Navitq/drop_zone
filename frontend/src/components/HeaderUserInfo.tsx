import React from 'react'
import style from '@/styles/header.module.scss'
import { useTranslations } from 'next-intl'

function HeaderUserInfo() {
    const t = useTranslations('header');
    return (
        <div className={style.headerUserInfo}>
            <div className={style.headerPromoCnt}>
                <input className={style.headerPromo} placeholder={t("promo_code_placeholder")}></input>
            </div>
            <div></div>
        </div>
    )
}

export default HeaderUserInfo
