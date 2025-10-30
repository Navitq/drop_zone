import React from 'react'

import style from '@/styles/profile.module.scss'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface PrUserInfoInt {
    imgPath?: string,
    nickName: string,
    link: string,
    accountType: string
}


function PrUserInfo(props: PrUserInfoInt): React.ReactNode {
    const t = useTranslations('profile')

    return (
        <div className={style.prUserInfo}>
            <div className={style.prUserMainInfo}>
                <div className={style.prUserImageCnt}>
                    <Image className={style.prImage} src={props.imgPath || '/images/'} alt={`${t('user_image')} ${props.nickName}`} width={86} height={86}></Image>
                </div>
                <div className={style.prUserNickname}>{props.nickName}</div>
            </div>

            <div className={style.prUserAccountType}>
                <Link href={props.link} target="_blank" rel="noopener noreferrer">
                    <Image src={`/images/profile_${(props.accountType).toLowerCase()}_icon.svg`} width={35} height={35} alt={props.accountType}></Image>
                </Link>
            </div>

        </div >
    )
}

export default PrUserInfo
