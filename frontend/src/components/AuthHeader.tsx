'use client'
import React from 'react'
import style from '@/styles/header.module.scss'
import Image from "next/image"
import { useTranslations } from 'next-intl'

import { AnimatePresence } from "motion/react"

import HeadModalUserSetting from '@/components/HeadModalUserSetting'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeUserModal, showUserModal, showPaymentModal } from '@/redux/modalReducer'

function AuthHeader(): React.ReactNode {
    const t = useTranslations('header');
    const money_amount = useAppSelector(state => state.user.userData.money_amount)
    const dispatch = useAppDispatch()
    const { isVisible } = useAppSelector(state => state.modal.userModal)
    const avatar = useAppSelector(state => state.user.userData.avatar)


    function handleOutsideClick() {
        document.removeEventListener('click', handleOutsideClick);
        dispatch(closeUserModal());
    }

    function closeModal() {
        handleOutsideClick()
    }

    function showModal() {
        if (!isVisible) {
            document.addEventListener('click', handleOutsideClick);
        }
        dispatch(showUserModal())
    }

    return (
        <div className={style.userData}>
            <div className={style.userTokens}>
                <div className={style.addUserTokens} onClick={() => { dispatch(showPaymentModal()) }}>
                    <Image priority={true} src="/images/add_tockens.svg" height={20} width={20} alt={t("get_more_tokens")}></Image>
                </div>
                <span className={style.userTokensText}>
                    {`${Number(money_amount).toFixed(2)} Dc`}
                </span>
            </div>
            <div className={style.userIconBlock} onClick={() => { showModal() }}>
                <div className={style.userIconCnt}>
                    <Image priority={true} className={style.userIcon} src={avatar || "/images/user_mock.jpg"} height={20} width={20} alt={t("user_icon")}></Image>
                </div>
                <AnimatePresence initial={false} mode="wait">
                    {
                        isVisible ? <HeadModalUserSetting close={() => { closeModal() }}></HeadModalUserSetting> : ""
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AuthHeader
