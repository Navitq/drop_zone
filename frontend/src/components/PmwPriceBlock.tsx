import React from 'react'
import style from "@/styles/modal.module.scss"

interface PmwPriceBlockInt {
    setSum: () => void;
    sum: number;
}

function PmwPriceBlock({ setSum, sum }: PmwPriceBlockInt): React.ReactNode {
    return (
        <div className={style.pmwPriceBlock} onClick={() => { setSum() }}>
            {`${sum} Dc`}
        </div>
    )
}

export default PmwPriceBlock
