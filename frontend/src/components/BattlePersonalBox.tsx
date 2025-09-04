import React from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

// import BattleStateCnt from "@/components/BattleStateCnt"
import BattleRouletteCnt from "@/components/BattleRouletteCnt"

interface BattlePersonalBoxInt {
    imgPath: string;
    userName: string
}

function BattlePersonalBox(props: BattlePersonalBoxInt): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={`${style.bpbCnt}`}>
            {/* <BattleStateCnt imgPath={"/images/battles_check.svg"} altText={t("player_waiting_alt")} text={t("player_waiting")}></BattleStateCnt> */}
            <BattleRouletteCnt></BattleRouletteCnt>
            <div className={`${style.bpbPlayerFieldCnt}  ${false ? style.bpbPlayerFieldCntLose : ""}`}>
                <div className={style.bpbPlayerProfileInfo}>
                    <div className={style.bpbPlayerProfileImgCnt}>
                        <Image fill src={props.imgPath} alt={t('players_image_alt')}></Image>
                    </div>
                    <div className={style.bpbPlayerProfileName}>{props.userName}</div>
                </div>
                <div className={style.bpbPlayerWonPrice}>{`${720} Dc`}</div>
            </div>
        </div>
    )
}

export default BattlePersonalBox
