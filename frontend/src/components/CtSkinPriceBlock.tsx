import React from 'react'
import style from '@/styles/contracts.module.scss'

function CtSkinPriceBlock(props: { text: string, price: number | string }): React.ReactNode {

    return (
        <div className={style.yourSkinPriceCnt}>
            <div className={style.yourSkinPrice}>{props.text}</div>
            <div className={style.yourSkinPriceAmount}>{`${props.price} Dc`}</div>
        </div>
    )
}

export default CtSkinPriceBlock
