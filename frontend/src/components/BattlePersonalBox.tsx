import React, { useState, useMemo, useRef } from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

import BattleStateCnt from "@/components/BattleStateCnt"
import BattleRouletteCnt from "@/components/BattleRouletteCnt"
import CtSlot from "@/components/CtSlot"
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeRoundNumber, openWonState, setWinnerColor } from '@/redux/activeBattleReducer'

interface BattlePersonalBoxInt {
    imgPath: string;
    userName: string;
    id: string;
}

interface GunData {
    id: string,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    price?: number,
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
    price: number,
    rarity: string,
    type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified',
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
}

interface ussualItemInt {
    case_id?: string
    icon_url: string
    id: string
    item_model: string
    item_style: string
    pk?: string
    price: number
    rarity: string
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
}

function BattlePersonalBox(props: BattlePersonalBoxInt): React.ReactNode {
    const t = useTranslations("battles")
    const { isGameStart, isGameFinished, showRoundWinner, wonRoundsGuys, winner_id, players_items, active_round, rounds_amount, winner_collection } = useAppSelector(state => state.activeBattle)
    const [items, setItems] = useState<ussualItemIntFront[] | GunData[]>([])
    const loseItemsRef = useRef<GunData[]>([]);
    const dispatch = useAppDispatch()

    function convertToGunDataArray(items: ussualItemInt[]): GunData[] {
        return items.map((item) => ({
            id: item.id,
            state: item.state,
            gunModel: item.item_model,
            gunStyle: item.item_style,
            gunPrice: item.price,
            imgPath: item.icon_url,
            type: item.rarity as GunData["type"],
        }));
    }




    const totalPrice = useMemo(() => {
        if (!items || items.length === 0) return 0;
        return items.reduce((sum, item) => sum + Number(item.price ?? item.gunPrice), 0);
    }, [items]);

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addElement(item: ussualItemIntFront) {
        // добавляем элемент
        setItems(state => [...state, item]);

        // меняем цвет победителя
        dispatch(setWinnerColor({ price: Number(item.price || 0), id: props.id }));

        // ждём 1 секунду
        await delay(1000);

        if (active_round < rounds_amount) {
            dispatch(changeRoundNumber());
        } else {
            dispatch(openWonState());

            // ждём ещё 1 секунду
            await delay(1000);

            if (winner_id !== props.id) {
                // ещё 1 секунда перед проигрышем
                await delay(1000);
                setItems([...loseItemsRef.current]);
            } else {
                await delay(1000);
                setItems([...convertToGunDataArray(winner_collection)])
            }
        }
    }

    // Ищем игрока с совпадающим id
    const playerData = useMemo(() => {
        const currentPersonData = players_items?.find?.(  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (p: any) => p.player?.id === props.id

        );

        if (loseItemsRef.current.length == 0) {
            console.log(currentPersonData, 'awdawd')
            if (currentPersonData?.lose_items) {
                loseItemsRef.current = convertToGunDataArray(currentPersonData.lose_items)
            }
        }

        if (active_round > 0 && currentPersonData?.items) {
            return currentPersonData.items[active_round - 1] ?? null;
        }

        return null;
    }, [players_items, props.id, active_round]);


    const slots = useMemo(() => {
        const length = items.length <= rounds_amount ? rounds_amount : items.length;
        return Array.from({ length }).map((_, index) => {
            const item = items[index] ?? undefined; // undefined для пустых слотов
            return (
                <div className="itemWithoutHover" key={index}>
                    <CtSlot click={() => { }} data={item} index={index} />
                </div>
            );
        });
    }, [items, rounds_amount]);

    return (
        <div className={style.bpbBlock}>
            <div className={`${style.bpbCnt}`}>
                {
                    isGameStart && playerData ? (
                        <BattleRouletteCnt addElement={(elem: ussualItemIntFront) => { addElement(elem) }} playerData={playerData ? playerData : null}></BattleRouletteCnt>
                    ) : (
                        !isGameFinished ? (<BattleStateCnt imgPath={props.id ? "/images/battles_check.svg" : "/images/battles_clock.svg"} altText={props.id ? t("player_waiting_alt") : t("player_ready_alt")} text={props.id ? t("player_ready") : t("player_waiting")}></BattleStateCnt>) : (
                            <BattleStateCnt imgPath={winner_id == props.id ? "/images/battles_successfully.svg" : "/images/battles_notsuccessfully.svg"} altText={winner_id == props.id ? t("win_alt") : t("lose_alt")} text={""}></BattleStateCnt>
                        )
                    )
                }

                {/* <BattleRouletteCnt addElement={(elem: ussualItemIntFront) => { addElement(elem) }} playerData={playerData ? playerData : null}></BattleRouletteCnt> */}
                <div className={`${props.id ? style.MobilePlayerFieldCnt : ""} ${style.bpbPlayerFieldCnt}  ${showRoundWinner && (wonRoundsGuys.length > 0 ? !wonRoundsGuys.includes(props.id) : false) ? style.bpbPlayerFieldCntLose : ""}`}>
                    {props.id ? (
                        <>
                            <div className={style.bpbPlayerProfileInfo}>
                                <div className={style.bpbPlayerProfileImgCnt}>
                                    <Image fill src={props.imgPath} alt={t('players_image_alt')}></Image>
                                </div>
                                <div className={style.bpbPlayerProfileName}>{props.userName}</div>
                            </div>
                            <div className={style.bpbPlayerWonPrice}>{`${Number((totalPrice).toFixed(2))} Dc`}</div>
                        </>
                    ) : (
                        <div className={style.bpbPlayerProfileInfoWaitingParent}>
                            <div className={style.bpbPlayerProfileInfoWaiting}>
                                {t('players_waiting')}
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <div className={`${style.bpbItemsCnt} bpbItemsCnt`}>
                {slots}
            </div>
        </div >
    )
}

export default React.memo(BattlePersonalBox)
