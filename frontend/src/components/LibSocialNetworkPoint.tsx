import React from 'react'
import Image from 'next/image'
import style from '@/styles/header.module.scss'

interface LibSocialNetworkPointInt {
    width: number;
    height: number;
    altText: string;
    imgPath: string;
}

function LibSocialNetworkPoint(props: LibSocialNetworkPointInt): React.ReactNode {
    return (
        <div className={style.libSocialPoint}>
            <div className={style.libPointCnt}>
                <Image src={props.imgPath} alt={props.altText} width={props.width} height={props.height}></Image>
            </div>
        </div>
    )
}

export default LibSocialNetworkPoint
