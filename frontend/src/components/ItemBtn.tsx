import React from 'react'
import style from '@/styles/cases.module.scss'

function ItemBtn(props: { price: string }): React.ReactNode {
    return (
        <div className={style.stItemBtnCnt}>
            <button className={style.stItemBtn}>{`${props.price}`}</button>
        </div>
    )
}

export default ItemBtn
