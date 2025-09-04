import React from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'

interface BattleStateCntInt {
    imgPath: string;
    altText: string;
    text: string;
}

function BattleStateCnt(props: BattleStateCntInt) {
    return (
        <div className={style.bstCnt}>
            <div className={style.bstStateCnt}>
                <div className={style.bstStateImgCnt}>
                    <Image fill src={props.imgPath} alt={props.altText}></Image>
                </div>
                <div className={style.bstStateTitle}>{props.text}</div>
            </div>
        </div>
    )
}

export default BattleStateCnt
