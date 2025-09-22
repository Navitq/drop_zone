'use client'

import React, { useState, useEffect } from 'react'
import style from '@/styles/header.module.scss'

import { useAppSelector } from '@/lib/hooks'
import LogInBlock from '@/components/LogInBlock'
import AuthHeader from '@/components/AuthHeader'
import { useTranslations } from 'next-intl'

function HeaderUserInfo() {
    const t = useTranslations('header');
    const isAuth = useAppSelector(state => state.user.isAuth)
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => {
        setHydrated(true) // отмечаем, что гидратация прошла
    }, [])
    return (
        <div className={style.headerUserInfo}>
            <div className={style.headerPromoCnt} >
                <input className={style.headerPromo} placeholder={t("promo_code_placeholder")}></input>
            </div>
            {hydrated && (isAuth ? <AuthHeader /> : <LogInBlock />)}
        </div >
    )
}

export default HeaderUserInfo
