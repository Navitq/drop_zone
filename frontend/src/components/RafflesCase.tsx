'use client'
import React from 'react';
import style from '@/styles/raffles.module.scss';
import { useTranslations } from 'next-intl';
import RafflesTimer from '@/components/RafflesTimer'
import Image from 'next/image';

import { useAppDispatch } from '@/lib/hooks'
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'
import { AxiosError } from "axios";

import { BACKEND_PATHS } from '@/utilites/urls'

import api from "@/lib/api";

interface RafflesCaseInt {
    id: string,
    gunModel: string,
    gunStyle: string,
    maxPlayerAmount: number,
    currentPlayerAmount: number,
    participationPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
    endTime: string // ISO string или timestamp конца раффла
}

function RafflesCase(props: RafflesCaseInt): React.ReactNode {
    const t = useTranslations('raffles');
    const dispatch = useAppDispatch()

    async function takePartRaffels() {
        try {
            const response = await api.post(BACKEND_PATHS.takePartRaffles, {
                id: props.id
            });

            // setRafflesItems(response.data)
        } catch (err) {
            const error = err as AxiosError;
            console.log(error.status)
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 402) {
                dispatch(showNoMoneyModal())
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    return (
        <div className={`${style.rafflesCaseCnt} ${style[`${props.type}CaseType`]}`}>
            <div className={style.rafflesTitleInfo}>
                <div className={style.weaponInfo}>
                    <span className={style.weaponModel}>{`${props.gunModel}`}&nbsp;&nbsp;|&nbsp;</span>
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
                <div className={style.rafflesDuration}>
                    <div className={style.durationImgCnt}>
                        <Image src={`/images/raffels_clock_${props.type}.svg`} alt={`${t('clock_alt')}`} width={30} height={30}></Image>
                    </div>
                    <div className={style.timerText}>
                        <RafflesTimer endTime={props.endTime}></RafflesTimer>
                    </div>
                </div>
                <div className={style.rafflesAplliedBtnCnt} onClick={() => { takePartRaffels() }}>
                    <button className={style.rafflesAplliedBtn}>{t('take_part')}</button>
                </div>
            </div>
        </div >
    )
}

export default RafflesCase;
