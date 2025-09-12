import React from 'react'
import style from '@/styles/modal.module.scss'
import { useTranslations } from 'next-intl'

import CaseBtnText from '@/components/CaseBtnText'

function UnAuthModalWrapped(props: { close: () => void }) {
    const t = useTranslations("header")
    return (
        <div className={style.uamwCnt} onClick={(e) => { e.stopPropagation() }}>
            <div className={style.uamwInfo}>
                <div>{t("you_are_unauth")}</div>
                <div>{t("auth_first")}</div>
            </div>
            <div className={style.uamwAuthBtn}>
                <CaseBtnText text={t("go_to_auth")} onClick={() => { props.close() }}></CaseBtnText>
            </div>
        </div>
    )
}

export default UnAuthModalWrapped
