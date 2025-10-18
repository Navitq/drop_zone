'use client'
import React, { useCallback } from 'react'

import style from '@/styles/header.module.scss'

import UserModalPoint from '@/components/UserModalPoint'
import UserModalPointLink from '@/components/UserModalPointLink'
import UserModalLanguageSettings from '@/components/UserModalLanguageSettings'
import { motion } from "motion/react"
import { useTranslations } from 'next-intl'
import { FRONTEND_PATHS, BACKEND_PATHS } from '@/utilites/urls'
import { useAppSelector } from '@/lib/hooks'
import { AxiosError } from "axios";

import api from "@/lib/api";

function HeadModalUserSetting({ close }: { close: () => void }): React.ReactNode {
    const t = useTranslations("homePage")
    const profileLink = useAppSelector(state => state.user.userData.id)

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            key={'HeadModalUserSetting'}
            onClick={(e) => { e.preventDefault() }}
            className={style.hmusCnt}>
            <UserModalPointLink close={close} link={`${FRONTEND_PATHS.profile}/${profileLink || ""}/`} text={t("md_profile")} imgPath={"/images/user_modal_profile.svg"} imgAlt={t("md_profie_alt")} height={20} width={20}></UserModalPointLink>
            <UserModalPointLink close={close} link={`${FRONTEND_PATHS.faq}`} text={t("md_faq")} imgPath={"/images/user_modal_question.svg"} imgAlt={t("md_question_alt")} height={20} width={20}></UserModalPointLink>
            <UserModalPoint close={close} text={t("md_support")} imgPath={"/images/user_modal_dialogue.svg"} imgAlt={t("md_dialogue_alt")} height={20} width={20}></UserModalPoint>
            <UserModalPoint close={() => { close(); logout() }} text={t("md_exit")} imgPath={"/images/user_modal_exit.svg"} imgAlt={t("md_exit_alt")} height={20} width={20}></UserModalPoint>
            <UserModalLanguageSettings></UserModalLanguageSettings>
        </motion.div>
    )
}

export default HeadModalUserSetting
