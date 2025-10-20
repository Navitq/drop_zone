import React from 'react'
import style from '@/styles/winInventoryBlock.module.scss'
import WibManagerBlock from '@/components/WibManagerBlock'
import WibSliderBlock from '@/components/WibSliderBlock'

function WonInventoryBlock(): React.ReactNode {
    return (
        <div className={style.wibBlock}>
            <div className={style.wibManager}>
                <WibManagerBlock></WibManagerBlock>
            </div>
            <div className={style.wibSliderCntBlock}>
                <WibSliderBlock></WibSliderBlock>
            </div>
        </div>
    )
}

export default WonInventoryBlock
