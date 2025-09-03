import React from 'react'
import style from '@/styles/header.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import axios from "axios";

import LibSocialNetworkPoint from '@/components/LibSocialNetworkPoint'
import HeaderLogInLanguageSm from '@/components/HeaderLogInLanguageSm'
import { BACKEND_PATHS } from '@/utilites/urls'
import api from '@/lib/api';

function LogInBlock(): React.ReactNode {
    const t = useTranslations('header');

    async function handleLogin(url: string) {
        const res = await api.get(url); // url относительный к baseURL из api.ts
        window.location.href = res.data.auth_url; // редиректим на Google
    }


    return (
        <>
            <div className={style.logInBlock}>
                <div className={style.userLogBlock}>
                    {t("logIn")}
                </div>
                <div className={style.logInIconBlock} >
                    <div className={style.logInIconCnt} onClick={() => { handleLogin(BACKEND_PATHS.steamAuth) }}>
                        <Image src="/images/steam_log_in.svg" width={25} height={25} alt={t('steam_log_in_alt')}></Image>
                    </div>
                    <div className={style.logInIconCnt} onClick={() => { handleLogin(BACKEND_PATHS.vkAuth) }}>
                        <Image priority={true} src="/images/vk_log_in.svg" width={25} height={25} alt={t('vk_log_in_alt')}></Image>
                    </div>
                    <div className={style.logInIconCnt} onClick={() => { handleLogin(BACKEND_PATHS.googleAuth) }}>
                        <Image priority={true} src="/images/google_log_in.svg" width={25} height={25} alt={t('google_log_in_alt')}></Image>
                    </div>
                </div>
            </div>
            <div className={style.logInBlockSm}>
                <div className={style.libTextSm}>{`${t('log_in')}:`}</div>
                <div className={style.libSocialNetworksCntSm}>

                    <div onClick={() => { handleLogin(BACKEND_PATHS.steamAuth) }} className={style.libPointCnt}>
                        <LibSocialNetworkPoint height={13} width={13} imgPath={"/images/steam_log_in.svg"} altText={t('steam_log_in_alt')}></LibSocialNetworkPoint>
                    </div>

                    <div onClick={() => { handleLogin(BACKEND_PATHS.vkAuth) }} className={style.libPointCnt}>
                        <LibSocialNetworkPoint height={15} width={15} imgPath={"/images/vk_log_in.svg"} altText={t('vk_log_in_alt')}></LibSocialNetworkPoint>
                    </div>
                    <div onClick={() => { handleLogin(BACKEND_PATHS.googleAuth) }} className={style.libPointCnt}>
                        <LibSocialNetworkPoint height={15} width={15} imgPath={"/images/google_log_in.svg"} altText={t('google_log_in_alt')}></LibSocialNetworkPoint>
                    </div>
                </div>
                <HeaderLogInLanguageSm></HeaderLogInLanguageSm>
            </div>
        </>
    )
}

export default LogInBlock
