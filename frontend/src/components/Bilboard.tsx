import React from 'react'

import style from '@/styles/homePage.module.scss'
import BdTime from '@/components/BdTime'
import Link from 'next/link'

interface BilboardInt {
    classPosition?: string,
    imgUrl: string,
    title: string,
    subTitle: string,
    seconds?: number,
    butText: string
    linkTo: string
}

function Bilboard(props: BilboardInt): React.ReactNode {
    return (
        <div className={`${props.classPosition ? style[props.classPosition] : ""} ${style.bilbordCnt}`}>
            <div style={{ backgroundImage: `url('${props.imgUrl}')` }}
                className={style.bilbordBg}></div>
            <div className={style.bdDataCnt}>
                <div className={style.bdTitle}>
                    {props.title}
                </div>
                <div className={style.bdSubTitle}>
                    {props.subTitle}
                </div>
                {props.seconds ? <BdTime seconds={props.seconds ? props.seconds : 0}></BdTime> : null}
            </div>
            <div className={style.bdButtonCnt}>
                <Link href={props.linkTo} className={`${style.bdButtonCntLink} ${style.bdButtonCntLink}`}>
                    <button className={style.bdButton}>{props.butText}</button>
                </Link>
            </div>
        </div>
    )
}

export default React.memo(Bilboard)
