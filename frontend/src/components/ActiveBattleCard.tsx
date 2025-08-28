import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { FRONTEND_PATHS } from '@/utilites/urls'
import Link from 'next/link'

import CaseBtnText from '@/components/CaseBtnText'


interface ActiveBattleCardInt {
    battleCases: string[],
    totalCost: number,
    playersImgPath: string[],
    battleId: string
}

function ActiveBattleCard(props: ActiveBattleCardInt): React.ReactNode {
    const t = useTranslations("battles");

    function formatNumber(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <div className={style.abcCnt}>
            <div className={style.abcDataCnt}>
                <div className={style.abcMainInfo}>
                    <div className={style.abcContainersInfo}>
                        <div className={style.abcBattleRounds}>
                            <div className={style.abcRoundsAmount}>{props.battleCases.length}</div>
                            <div className={style.abcRoundsTxt}>{t('round')}</div>
                        </div>
                        <div className={style.abcContainersImages}>
                            {props.battleCases.map((value, index) => {
                                return (
                                    <div className={style.abcBlockCaseImg} key={index}>
                                        <Image
                                            src={value}
                                            alt={t('case_image')}
                                            width={83}
                                            height={76}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className={style.abcCardPriceBlock}>
                        <div className={style.abcCardPriceTitle}>{t('cost')}</div>
                        <div className={style.abcCardPrice}>{`${formatNumber(props.totalCost)} Dc`}</div>
                    </div>
                </div>
                <div className={style.abcPlayerInfo}>
                    <div className={style.abcCardPlayerCnt}>
                        {props.playersImgPath.map((value, index) => {
                            return (
                                <div key={index} className={style.cardPlayers}>
                                    <Image height={46} width={54} src={value ? value : "/images/mn_battle_void_person.svg"} alt={t(`player_${index}`)}></Image>
                                </div>
                            )
                        })}
                    </div>
                    <div className={style.abcCardPrice}>
                        <Link href={FRONTEND_PATHS.battlesConnect(props.battleId)}>
                            <CaseBtnText text={t('login_verb')} />
                        </Link>
                    </div>
                </div>
            </div>
            <div className={style.abcSeparator}>
            </div>
        </div>
    )
}

export default ActiveBattleCard
