import React from 'react'

import style from '@/styles/profile.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface PrOwnerInfoInt {
    imgPath?: string,
    nickName: string,
    balance: number,
    link: string,
    accountType: "Steam" | "Telegram" | "Vk"
}

function PrOwnerInfo(props: PrOwnerInfoInt): React.ReactNode {
    const t = useTranslations('profile');
    return (
        <div className={style.prOwnerInfo}>
            <div className={style.prOwnerImageCnt}>
                <Image className={style.prImage} alt={`${t('user_image')} ${props.nickName}`} src={props.imgPath || '/images/'} width={168} height={168} ></Image>
            </div>
            <div className={style.prOwnerDataBlock}>
                <div className={style.prOwnerDataCnt}>
                    <div className={style.prNicknameAccountCnt}>
                        <div className={style.prNickname}>{props.nickName}</div>
                        <Link href={props.link} target="_blank" rel="noopener noreferrer">
                            <div className={style.prAccountType}>{`${props.accountType}-${t('account')}`}</div>
                        </Link>
                    </div>
                    <div className={style.prAccountBalanceCnt}>
                        <div className={style.prAccountBalance}>{`${t('balance')}:`}</div>
                        <div className={style.prCurrentBalanceCnt}>
                            <div className={style.prCurrentBalance}>{`${props.balance} Dc`}</div>
                            <button className={style.prTopUpBalance}>{`${t('top_up')}`}</button>
                        </div>
                    </div>
                </div>
                <div className={style.prLogOutCnt}>
                    <button className={style.prLogOut}>{t('logout')}</button>
                    <Image alt={t('profile_exit_alt')} src={'/images/profile_exit.svg'} width={15} height={15}></Image>

                </div>
            </div>
        </div>
    )
}

export default PrOwnerInfo
