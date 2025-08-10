import React from 'react'
import style from '@/styles/cases.module.scss'

function CaseBtn(props: { price: number }): React.ReactNode {
    return (
        <div className={style.stCaseBtnCnt}>
            <button className={style.stCaseBtn}>{`${props.price} Dc`}</button>
        </div>
    )
}

export default CaseBtn
