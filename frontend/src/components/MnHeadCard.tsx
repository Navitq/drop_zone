import React from 'react'
import style from '@/styles/battles.module.scss'
import Image from 'next/image'

interface MnHeadCardInt {
    imgPath: string,
    altImg: string,
    title: string,
    amount: number
}


function MnHeadCard(props: MnHeadCardInt): React.ReactNode {
    return (
        <div className={style.mnHeadCard}>
            <div className={style.mnHeadImgBlock}>
                <Image className={style.mnHeadImg} src={props.imgPath} alt={props.altImg} fill></Image>
            </div>
            <div className={style.mnHeadInfoBlock}>
                <div className={style.mnHeadInfoType}>{props.title}</div>
                <div className={style.mnHeadInfoAmount}>{props.amount}</div>
            </div>
        </div>
    )
}

export default MnHeadCard
