import React from 'react'

import style from '@/styles/itemStyle.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface ItemSmInt {
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic"
}

function ItemSm(props: ItemSmInt): React.ReactNode {
    const t = useTranslations("items")
    return (
        <div className={`${style.smItemCnt} ${style[props.type + "ItemSmType"]}`}>
            <div className={style.smItemImgCnt}>
                <Image alt={`${props.gunModel}, ${props.gunStyle}`} src={props.imgPath} className={style.smItemImg}></Image>
            </div>
            <div className={style.smItemInfoBlck}>
                <div className={style.smItemInfoCnt}>
                    <div className={style.smItemGunModel}>{props.gunModel}</div>
                    <div className={style.smItemGunSeparator}>|</div>
                    <div className={style.smItemGunStyle}>{props.gunStyle}</div>
                </div>
                <div className={style.smItemGunStyle}>{props.gunPrice}</div>
                <button className={style.smItemAddButton}>{t('add_good')}</button>
            </div>
        </div>
    )
}

export default ItemSm
