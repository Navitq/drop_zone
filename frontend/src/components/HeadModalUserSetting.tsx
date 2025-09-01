import React from 'react'

import style from '@/styles/header.module.scss'

import UserModalPoint from '@/components/UserModalPoint'
import UserModalPointLink from '@/components/UserModalPointLink'
import UserModalLanguageSettings from '@/components/UserModalLanguageSettings'
import { motion } from "motion/react"

import { useTranslations } from 'next-intl'
import { FRONTEND_PATHS } from '@/utilites/urls'

function HeadModalUserSetting({ close }: { close: () => void }): React.ReactNode {
    const t = useTranslations("homePage")

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            key={'HeadModalUserSetting'}
            onClick={(e) => { e.preventDefault() }}
            className={style.hmusCnt}>
            <UserModalPointLink close={close} link={`${FRONTEND_PATHS.profile}`} text={t("md_profile")} imgPath={"/images/user_modal_profile.svg"} imgAlt={t("md_profie_alt")} height={20} width={20}></UserModalPointLink>
            <UserModalPointLink close={close} link={`${FRONTEND_PATHS.faq}`} text={t("md_faq")} imgPath={"/images/user_modal_question.svg"} imgAlt={t("md_question_alt")} height={20} width={20}></UserModalPointLink>
            <UserModalPoint close={close} text={t("md_support")} imgPath={"/images/user_modal_dialogue.svg"} imgAlt={t("md_dialogue_alt")} height={20} width={20}></UserModalPoint>
            <UserModalPoint close={close} text={t("md_exit")} imgPath={"/images/user_modal_exit.svg"} imgAlt={t("md_exit_alt")} height={20} width={20}></UserModalPoint>
            <UserModalLanguageSettings></UserModalLanguageSettings>
        </motion.div>
    )
}

export default HeadModalUserSetting
