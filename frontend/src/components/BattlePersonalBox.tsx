import React, { useState } from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

import BattleStateCnt from "@/components/BattleStateCnt"
import BattleRouletteCnt from "@/components/BattleRouletteCnt"
import CtSlot from "@/components/CtSlot"
import { useAppSelector } from '@/lib/hooks';

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
    const { isGameStart, players_items, active_round, rounds_amount } = useAppSelector(state => state.activeBattle)

    const [items, setItems] = useState<ussualItemIntFront[]>([])

    function addElement(item: ussualItemIntFront) {
        console.log(item, "awdwaddwawdaw2da")
        setItems((state) => {
            return [...state, item]
        })
    }

    // Ищем игрока с совпадающим id
    const currentPersonData = players_items?.find?.(
        (p: any) => p.player?.id === props.id
    ) ?? null;

    let playerData = null;

    if (active_round > 0 && currentPersonData?.items) {
        playerData = currentPersonData.items[active_round - 1] ?? null;
    }

    return (
        <div className={style.bpbBlock}>
            <div className={`${style.bpbCnt}`}>
                {
                    isGameStart ? (
                        <BattleRouletteCnt addElement={(elem: ussualItemIntFront) => { addElement(elem) }} playerData={playerData ? playerData : null}></BattleRouletteCnt>
                    ) : (
                        <BattleStateCnt imgPath={props.id ? "/images/battles_check.svg" : "/images/battles_clock.svg"} altText={props.id ? t("player_waiting_alt") : t("player_ready_alt")} text={props.id ? t("player_ready") : t("player_waiting")}></BattleStateCnt>
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
                    return <CtSlot key={index} data={item} index={index} />;
                })}

                {/* <CtSlot data={{ imgPath: '/images/example_gun_blue.png', gunModel: "AK-47", type: "usuall", gunStyle: 'LIZARD PIZARD', gunPrice: 58.48 }} index={1} />
                <CtSlot data={{ imgPath: '/images/example_gun_blue.png', gunModel: "AK-47", type: "epic", gunStyle: 'LIZARD PIZARD', gunPrice: 58.48 }} index={2} />
                <CtSlot index={2} /> */}

            </div>
        </div>
    )
}

export default React.memo(BattlePersonalBox)
