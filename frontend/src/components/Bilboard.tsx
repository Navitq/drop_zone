import React from 'react'

import style from '@/styles/homePage.module.scss'
import BdTime from '@/components/BdTime'

interface BilboardInt {
    classPosition?: string,
    time?: boolean,
    imgUrl: string,
    title: string,
    subTitle: string,
    seconds?: number,
    butText: string
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
                {props.time ? <BdTime seconds={props.seconds ? props.seconds : 0}></BdTime> : null}
            </div>
            <div className={style.bdButtonCnt}>
                <button className={style.bdButton}>{props.butText}</button>
            </div>
        </div>
    )
}

export default React.memo(Bilboard)
