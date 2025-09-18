'use client'

import React from 'react'

import style from '@/styles/itemStyle.module.scss'
import { useAppSelector } from '@/lib/hooks'

import Image from 'next/image'

function UpgradeItemCardServet(props: { close: () => void }): React.ReactNode {
    const itemData = useAppSelector(state => state.upgrade.itemServerData)
    return (
        <div className={`${style.uicCnt} ${style[`${itemData.type}UicCnt`]} `}>
            <div className={style.hoverUicCnt}>
                <div className={style.hoverUicCntClose} onClick={() => { props.close() }}>
                </div>
            </div>
            <div className={style.uicImgCnt}>
                <Image fill src={itemData.imgPath} alt={`${itemData.gunModel}| ${itemData.gunStyle}`}></Image>
            </div>
            <div className={style.uicItemInfo}>
                <div className={style.uicTextInfo}>
                    <div className={style.uicGunModel}>{`${itemData.gunModel}   |`}&nbsp;</div>
                    <div className={style.uicGunStyle}>{itemData.gunStyle}</div>
                </div>
                <div className={style.uicPriceInfo}>{itemData.gunPrice} Dc</div>
            </div>
        </div>
    )
}

export default UpgradeItemCardServet
