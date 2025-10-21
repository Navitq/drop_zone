import React from 'react'
import style from '@/styles/winInventoryBlock.module.scss'
import WibManagerBlock from '@/components/WibManagerBlock'
import WibSliderBlockCnt from '@/components/WibSliderBlockCnt'

function WonInventoryBlock(): React.ReactNode {
    return (
        <div className={style.wibBlock}>
            <div className={style.wibManager}>
                <WibManagerBlock></WibManagerBlock>
            </div>
            <div className={style.wibSliderCntBlock}>
                <WibSliderBlockCnt></WibSliderBlockCnt>
            </div>
        </div>
    )
}

export default WonInventoryBlock
