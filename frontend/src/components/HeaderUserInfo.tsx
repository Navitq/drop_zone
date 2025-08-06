import React from 'react'
import style from '@/styles/header.module.scss'
import { useTranslations } from 'next-intl'
import Image from "next/image"

function HeaderUserInfo() {
    const t = useTranslations('header');
    return (
        <div className={style.headerUserInfo}>
            <div className={style.headerPromoCnt}>
                <input className={style.headerPromo} placeholder={t("promo_code_placeholder")}></input>
            </div>
            <div className={style.userData}>
                <div className={style.userTokens}>
                    <div className={style.addUserTokens}>
                        <Image priority={true} src="/images/add_tockens.svg" height={20} width={20} alt={t("get_more_tokens")}></Image>
                    </div>
                    <span className={style.userTokensText}>
                        {`${720} Dc`}
                    </span>
                </div>
                <div  className={style.userIconBlock}>
                    <div className={style.userIconCnt}>
                        <Image priority={true} className={style.userIcon} src="/images/user_mock.jpg" height={20} width={20} alt={t("user_icon")}></Image>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HeaderUserInfo
