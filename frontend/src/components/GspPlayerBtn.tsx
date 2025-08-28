import React from 'react'

import style from '@/styles/battles.module.scss'

function GspPlayerBtn(props: { text: number | string }): React.ReactNode {
    return (
        <div className={style.gspPlayerBtn}>
            {props.text}
        </div>
    )
}

export default GspPlayerBtn
