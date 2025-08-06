'use client'

import React from 'react'
import style from '@/styles/header.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

function LogInBlock(): React.ReactNode {
    const t = useTranslations('header');
    return (
        <div className={style.logInBlock}>
            <div className={style.userLogBlock}>
                {t("logIn")}
            </div>
            <div className={style.logInIconBlock} >
                <div className={style.logInIconCnt}>
                    <Image src="/images/steam_log_in.svg" width={25} height={25} alt={t('steam_log_in_alt')}></Image>
                </div>
                <div className={style.logInIconCnt}>
                    <Image priority={true} src="/images/vk_log_in.svg" width={25} height={25} alt={t('vk_log_in_alt')}></Image>
                </div>
                <div className={style.logInIconCnt}>
                    <Image priority={true} src="/images/google_log_in.svg" width={25} height={25} alt={t('google_log_in_alt')}></Image>
                </div>
            </div>
        </div>
    )
}

export default LogInBlock
