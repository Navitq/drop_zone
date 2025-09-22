import React from 'react'
import style from '@/styles/cases.module.scss'


interface ItemBtnProps {
    isActive?: boolean;         // опционально
    price: string;
    activateBtn: () => void;
}

function ItemBtn({ isActive = false, price, activateBtn }: ItemBtnProps): React.ReactNode {

    return (
        <div
            className={`${style.stItemBtnCnt} ${isActive ? style.stItemBtnCntActive : ''}`}
            onClick={activateBtn}
        >
            <button className={style.stItemBtn}>
                {price}
            </button>
        </div>
    )
}

export default React.memo(ItemBtn)
