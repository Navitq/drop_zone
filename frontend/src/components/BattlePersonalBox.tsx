import React, { useState, useMemo } from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

import BattleStateCnt from "@/components/BattleStateCnt"
import BattleRouletteCnt from "@/components/BattleRouletteCnt"
import CtSlot from "@/components/CtSlot"
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeRoundNumber, openWonState } from '@/redux/activeBattleReducer'

interface BattlePersonalBoxInt {
    imgPath: string;
    userName: string;
    id: string;
    money_amount: number
}

interface GunData {
    id: string,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

interface ussualItemIntFront {
    case_id?: string,
    imgPath: string,
    id: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number
    pk?: string,
    price: string,
    rarity: string,
    type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified',
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
}

function BattlePersonalBox(props: BattlePersonalBoxInt): React.ReactNode {
    const t = useTranslations("battles")
    const { isGameStart, isGameFinished, winner_id, players_items, active_round, rounds_amount } = useAppSelector(state => state.activeBattle)
    const dispatch = useAppDispatch()
    const [items, setItems] = useState<ussualItemIntFront[]>([])
    function addElement(item: ussualItemIntFront) {

        setItems((state) => {
            return [...state, item]
        })
        if (active_round < rounds_amount) {
            dispatch(changeRoundNumber())
        } else {
            dispatch(openWonState())
        }
    }

    // Ищем игрока с совпадающим id
    const playerData = useMemo(() => {
        const currentPersonData = players_items?.find?.(
            (p: any) => p.player?.id === props.id
        );

        if (active_round > 0 && currentPersonData?.items) {
            return currentPersonData.items[active_round - 1] ?? null;
        }
        console.log(1111111111111111111111111111112222222333333)
        return null;
    }, [players_items, props.id, active_round]);

    return (
        <div className={style.bpbBlock}>
            <div className={`${style.bpbCnt}`}>
                {
                    isGameStart && playerData ? (
                        <BattleRouletteCnt addElement={(elem: ussualItemIntFront) => { addElement(elem) }} playerData={playerData ? playerData : null}></BattleRouletteCnt>
                    ) : (
                        !isGameFinished ? (<BattleStateCnt imgPath={props.id ? "/images/battles_check.svg" : "/images/battles_clock.svg"} altText={props.id ? t("player_waiting_alt") : t("player_ready_alt")} text={props.id ? t("player_ready") : t("player_waiting")}></BattleStateCnt>) : (
                            <BattleStateCnt imgPath={winner_id == props.id ? "/images/battles_check.svg" : "/images/battles_clock.svg"} altText={winner_id == props.id ? t("win_alt") : t("lose_alt")} text={winner_id == props.id ? t("win") : t("lose")}></BattleStateCnt>
                        )
                    )
                }


                <div className={`${style.bpbPlayerFieldCnt}  ${false ? style.bpbPlayerFieldCntLose : ""}`}>
                    {props.id ? (
                        <>
                            <div className={style.bpbPlayerProfileInfo}>
                                <div className={style.bpbPlayerProfileImgCnt}>
                                    <Image fill src={props.imgPath} alt={t('players_image_alt')}></Image>
                                </div>
                                <div className={style.bpbPlayerProfileName}>{props.userName}</div>
                            </div>
                            <div className={style.bpbPlayerWonPrice}>{`${Number((props.money_amount).toFixed(2))} Dc`}</div>
                        </>
                    ) : (
                        <div className={style.bpbPlayerProfileInfoWaiting}>
                            {t('players_waiting')}
                        </div>
                    )}

                </div>
            </div>
            <div className={`${style.bpbItemsCnt}`}>
                {Array.from({ length: rounds_amount }).map((_, index) => {
                    const item = items[index] ?? undefined; // undefined для пустых слотов
                    console.log(item)
                    return <div className='itemWithoutHover' key={index}><CtSlot click={() => { }} data={item} index={index} /></div>;
                })}

            </div>
        </div >
    )
}

export default React.memo(BattlePersonalBox)
