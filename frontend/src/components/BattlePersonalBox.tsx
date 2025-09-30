import React from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

import BattleStateCnt from "@/components/BattleStateCnt"
import BattleRouletteCnt from "@/components/BattleRouletteCnt"
import CtSlot from "@/components/CtSlot"
interface BattlePersonalBoxInt {
    imgPath: string;
    userName: string;
    id: string;
    money_amount: number
}

function BattlePersonalBox(props: BattlePersonalBoxInt): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={style.bpbBlock}>
            <div className={`${style.bpbCnt}`}>
                <BattleStateCnt imgPath={props.id ? "/images/battles_check.svg" : "/images/battles_clock.svg"} altText={props.id ? t("player_waiting_alt") : t("player_ready_alt")} text={props.id ? t("player_ready") : t("player_waiting")}></BattleStateCnt>
                {/* <BattleRouletteCnt></BattleRouletteCnt> */}
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
                {/* <CtSlot data={{ imgPath: '/images/example_gun_blue.png', gunModel: "AK-47", type: "usuall", gunStyle: 'LIZARD PIZARD', gunPrice: 58.48 }} index={1} />
                <CtSlot data={{ imgPath: '/images/example_gun_blue.png', gunModel: "AK-47", type: "epic", gunStyle: 'LIZARD PIZARD', gunPrice: 58.48 }} index={2} />
                <CtSlot index={2} /> */}
            </div>
        </div>
    )
}

export default React.memo(BattlePersonalBox)
