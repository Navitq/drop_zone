import React from 'react'

import Image from 'next/image'

import style from '@/styles/profile.module.scss'

interface PrActivityInt {
    activityPath: string,
    activityName: string,
    activityAmount: number
}

function PrActivity(props: PrActivityInt): React.ReactNode {
    return (
        <div className={style.prActivity}>
            <div className={style.prActivityImageCnt}>
                <Image alt={`${props.activityName}`} src={props.activityPath} fill className={style.prActivityImage}></Image>
            </div>
            <div className={style.prActivityData}>
                <div className={style.prActivityName}>{props.activityName}</div>
                <div className={style.prActivityAmount}>{props.activityAmount}</div>
            </div>
        </div>
    )
}

export default PrActivity
