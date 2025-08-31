'use client'

import React from 'react'
import style from '@/styles/header.module.scss'

import { useAppSelector } from '@/lib/hooks'
import LogInBlock from '@/components/LogInBlock'
import AuthHeader from '@/components/AuthHeader'
import { useTranslations } from 'next-intl'

function HeaderUserInfo() {
    const t = useTranslations('header');
    const isAuth = useAppSelector(state => state.user.isAuth)

    return (
        <div className={style.headerUserInfo}>
            <div className={style.headerPromoCnt}>
                <input className={style.headerPromo} placeholder={t("promo_code_placeholder")}></input>
            </div>
            {isAuth ? <AuthHeader></AuthHeader> : <LogInBlock></LogInBlock>}
        </div >
    )
}

export default HeaderUserInfo
