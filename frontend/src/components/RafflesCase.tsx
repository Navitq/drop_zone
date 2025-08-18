import React from 'react'

import style from '@/styles/raffles.module.scss';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface RafflesCaseInt {
    gunModel: string,
    gunStyle: string,
    maxPlayerAmount: number,
    currentPlayerAmount: number,
    participationPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic"
}


function RafflesCase(props: RafflesCaseInt): React.ReactNode {
    const t = useTranslations('raffles');
    return (
        <div className={`${style.rafflesCaseCnt} ${style[`${props.type}CaseType`]}`}>
            <div className={style.rafflesTitleInfo}>
                <div className={style.weaponInfo}>
                    <span className={style.weaponModel}>{`${props.gunModel}`}&nbsp;&nbsp;|</span>
                    <span className={style.weaponStyle}>{`${props.gunStyle}`}</span>
                </div>
                <div className={style.rafflesPlayersInfo}>
                    <div className={style.rafflesManIconCnt}>
                        <Image src={'/images/raffles_man.svg'} alt={t('man_alt')} width={30} height={30}></Image>
                    </div>
                    <span className={style.rafflesPlayerAmount}>
                        {`${props.currentPlayerAmount}/${props.maxPlayerAmount}`}
                    </span>
                </div>
            </div>
            <div className={style.weaponImgCnt}>
                <Image alt={`${t('image_alt')} ${props.gunModel} - ${props.gunStyle}`} fill className={style.weaponImg} src={props.imgPath}></Image>
            </div>
            <div className={style.weaponGameInfo}>
                <div className={style.priceInfoCnt}>
                    <div className={style.priceInfoTitle}>{t('activity_price')}</div>
                    <div className={style.priceInfo}>{`${props.participationPrice} Dc`}</div>
                </div>
                <div></div>
                <div></div>
            </div>
        </div >
    )
}

export default RafflesCase
