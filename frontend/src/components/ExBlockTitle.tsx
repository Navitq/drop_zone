import React from 'react'

import style from '@/styles/upgrades.module.scss'

function ExBlockTitle(props: { title: string }) {

    return (
        <div className={style.exBlockTitleCnt}>
            <div className={style.exBlockTitle}>{props.title}</div>
        </div>
    )
}

export default ExBlockTitle
