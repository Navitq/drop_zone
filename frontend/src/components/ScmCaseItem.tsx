import React from 'react'
import style from '@/styles/itemStyle.module.scss'
import Image from 'next/image'

interface ItemSmInt {
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified"
}

function ScmCaseItem(props: ItemSmInt): React.ReactNode {

    return (
        <div className={`${style.ScmCaseItem} ${style[props.type + "ScmCaseItem"]}`}>
            <div className={style.scmCaseImgCnt}>
                <Image fill alt={`${props.gunModel}, ${props.gunStyle}`} src={props.imgPath} className={style.smItemImg}></Image>
            </div>
            <div className={style.scmCaseInfoBlck}>
                <div className={style.scmCaseInfoCnt}>
                    <div className={style.scmCaseGunModel}>{`${props.gunModel} |`}</div>
                    <div className={style.scmCaseGunStyle}>{`${props.gunStyle}`}</div>
                </div>
                <div className={`${style.scmCaseGunPrice}`}>{`${props.gunPrice} Dc`}</div>
            </div>
        </div>
    )
}

export default ScmCaseItem
