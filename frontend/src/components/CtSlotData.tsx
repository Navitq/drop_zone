import React from 'react'

import style from '@/styles/itemStyle.module.scss'

import Image from 'next/image'

interface GunData {
    gunModel: string
    gunStyle: string
    gunPrice: number
    imgPath: string
    type: "usuall" | "rare" | "elite" | "epic" | "classified"
}

interface CtSlotDataInt {
    data: GunData
}
// синий фиолтовый розовый красный золотой
function CtSlotData(props: CtSlotDataInt): React.ReactNode {

    return (
        <div className={`${style.smItemCnt} ${style[props.data.type + "ItemSmType"]}`}>
            <div className={style.smItemImgCnt}>
                <Image fill alt={`${props.data.gunModel}, ${props.data.gunStyle}`} src={props.data.imgPath} className={style.smItemImg}></Image>
            </div>
            <div className={style.smItemInfoBlck}>
                <div className={style.smItemInfoCnt}>
                    <div className={style.smItemGunModel}>{`${props.data.gunModel} |`}</div>
                    <div className={style.smItemGunStyle}>{`${props.data.gunStyle}`}</div>
                </div>
                <div className={`${style.smItemGunPrice} ${style.smItemGunPriceMode}`}>{`${props.data.gunPrice} Dc`}</div>
            </div>
        </div>
    )
}

export default CtSlotData
