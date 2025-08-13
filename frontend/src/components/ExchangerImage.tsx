import React, { useTransition } from 'react'

import style from '@/styles/upgrades.module.scss';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ImageData {
    imgUrl: string,
    imgAltKey: string,
    width: number,
    height: number
}
function ExchangerImage(props: ImageData): React.ReactNode {
    const t = useTranslations("upgrades")
    return (
        <div className={style.exClientImgCnt}>
            <Image className={style.exClientImg} alt={t(props.imgAltKey)} width={props.width} height={props.height} src={props.imgUrl}></Image>
        </div>
    )
}

export default ExchangerImage
