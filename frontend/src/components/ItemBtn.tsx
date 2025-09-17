import React from 'react'
import style from '@/styles/cases.module.scss'

function ItemBtn(props: { price: string, activateBtn: () => void }): React.ReactNode {
    return (
        <div className={style.stItemBtnCnt} onClick={() => { props.activateBtn() }}>
            <button className={style.stItemBtn}>{`${props.price}`}</button>
        </div>
    )
}

export default ItemBtn
