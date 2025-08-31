import React from 'react'

import style from '@/styles/header.module.scss'

import UserModalPoint from '@/components/UserModalPoint'
import UserModalPointLink from '@/components/UserModalPointLink'
import UserModalLanguageSettings from '@/components/UserModalLanguageSettings'

import { useTranslations } from 'next-intl'
import { FRONTEND_PATHS } from '@/utilites/urls'

function HeadModalUserSetting(): React.ReactNode {
    const t = useTranslations("homePage")

    return (
        <div className={style.hmusCnt}>
            <UserModalPointLink link={`${FRONTEND_PATHS.profile}`} text={t("md_profile")} imgPath={"/images/user_modal_profile.svg"} imgAlt={t("md_profie_alt")} height={20} width={20}></UserModalPointLink>
            <UserModalPointLink link={`${FRONTEND_PATHS.faq}`} text={t("md_faq")} imgPath={"/images/user_modal_question.svg"} imgAlt={t("md_question_alt")} height={20} width={20}></UserModalPointLink>
            <UserModalPoint text={t("md_support")} imgPath={"/images/user_modal_dialogue.svg"} imgAlt={t("md_dialogue_alt")} height={20} width={20}></UserModalPoint>
            <UserModalPoint text={t("md_exit")} imgPath={"/images/user_modal_exit.svg"} imgAlt={t("md_exit_alt")} height={20} width={20}></UserModalPoint>
            <UserModalLanguageSettings></UserModalLanguageSettings>
        </div>
    )
}

export default HeadModalUserSetting
