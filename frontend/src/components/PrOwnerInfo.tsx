'use client'
import React, { useCallback } from 'react'

import style from '@/styles/profile.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useAppSelector } from '@/lib/hooks'
import { useDispatch } from 'react-redux'
import { showPaymentModal } from '@/redux/modalReducer'
import { AxiosError } from "axios";
import { BACKEND_PATHS } from '@/utilites/urls'

import api from "@/lib/api";

interface PrOwnerInfoInt {
    imgPath?: string,
    nickName: string,
    balance: number,
    link: string,
    accountType: "Steam" | "Google" | "Vk"
}

function PrOwnerInfo(props: PrOwnerInfoInt): React.ReactNode {
    const t = useTranslations('profile');
    const dispatch = useDispatch()

    function openPaymentModal() {
        dispatch(showPaymentModal())
    }

    const logout = useCallback(async () => {
        try {
            // 👇 корректный запрос на logout endpoint (например /api/logout/)
            await api.post(BACKEND_PATHS.logout, {}, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            const error = err as AxiosError;
            console.error("❌ Logout error:", error);
            window.location.reload();
        }
    }, []);

    const { avatar, username, id, provider } = useAppSelector(state => state.user.userData)
    return (
        <div className={style.prOwnerInfo}>
            <div className={style.prOwnerImageCnt}>
                <Image className={style.prImage} alt={`${t('user_image')} ${props.nickName}`} src={avatar || props.imgPath || '/images/'} fill ></Image>
            </div>
            <div className={style.prOwnerDataBlock}>
                <div className={style.prOwnerDataCnt}>
                    <div className={style.prNicknameAccountCnt}>
                        <div className={style.prNickname}>{username || props.nickName}</div>
                        <Link href={props.link} target="_blank" rel="noopener noreferrer">
                            <div className={style.prAccountType}>{`${provider || props.accountType}-${t('account')}`}</div>
                        </Link>
                    </div>
                    <div className={style.prAccountBalanceCnt}>
                        <div className={style.prAccountBalance}>{`${t('balance')}:`}</div>
                        <div className={style.prCurrentBalanceCnt}>
                            <div className={style.prCurrentBalance}>{`${props.balance} Dc`}</div>
                            <button className={style.prTopUpBalance} onClick={() => { openPaymentModal() }}>{`${t('top_up')}`}</button>
                        </div>
                    </div>
                </div>
                <div className={style.prLogOutCnt}>
                    <button className={style.prLogOut} onClick={() => { logout() }}>{t('logout')}</button>
                    <Image alt={t('profile_exit_alt')} src={'/images/profile_exit.svg'} width={15} height={15}></Image>

                </div>
            </div>
        </div>
    )
}

export default PrOwnerInfo
