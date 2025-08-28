import React from 'react'

import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import GspPlayerBtn from '@/components/GspPlayerBtn'
import CaseBtnText from '@/components/CaseBtnText'
import CleanGameSettings from '@/components/CleanGameSettings'

function GameSetupPanel(): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={style.gameSetupPanel}>
            <div className={style.gspPlayerInfoBlock}>
                <div className={style.gspPlayerImgCnt}>
                    <Image src={"/images/cr_battle_people.svg"} alt={t('gsp_people')} width={45} height={45}></Image>
                </div>
                <div className={style.gspPlayerAmountCnt}>
                    <div className={style.gspPlayerAmountTxt}>{t('player_amoun')}</div>
                    <div className={style.gspPlayerCnt}>
                        <GspPlayerBtn text={2}></GspPlayerBtn>
                        <GspPlayerBtn text={3}></GspPlayerBtn>
                        <GspPlayerBtn text={4}></GspPlayerBtn>
                    </div>
                </div>
            </div>
            <div className={style.gspPlayerBtnGroup}>
                <CleanGameSettings text={t('clean')}></CleanGameSettings>

                <CaseBtnText text={t('create')} />
            </div>
        </div>
    )
}

export default GameSetupPanel
