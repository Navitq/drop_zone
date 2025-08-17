import React from 'react'
import style from '@/styles/cases.module.scss'

function CaseBtnText(props: { text: string }): React.ReactNode {
    return (
        <div className={style.stCaseBtnCnt}>
            <button className={style.stCaseBtn}>{`${props.text}`}</button>
        </div>
    )
}

export default CaseBtnText
