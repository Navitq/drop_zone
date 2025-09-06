import React from 'react'
import style from '@/styles/cases.module.scss'

function CaseBtn(props: { price: number, buyCaseModal?: () => void }): React.ReactNode {
    return (
        <div className={style.stCaseBtnCnt} onClick={() => { props.buyCaseModal?.() }}>
            <button className={style.stCaseBtn}>{`${props.price} Dc`}</button>
        </div>
    )
}

export default CaseBtn
