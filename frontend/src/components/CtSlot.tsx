import React from 'react'

import style from '@/styles/contracts.module.scss'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import CtSlotData from '@/components/CtSlotData'


interface GunData {
    id: string,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function CtSlot(props: { data?: GunData, index: number, click?: () => void, }): React.ReactNode {

    const t = useTranslations('contracts');

    return (
        <div className={`${style.ctSlotCnt}`} onClick={() => { props.click?.() }}>
            {
                props.data && props.click ? (
                    <>
                        <div className={style.ctSlotCntHover}>
                            <div className={style.ctSlotCntHoverCross}></div>
                        </div>
                        <CtSlotData data={props.data}></CtSlotData>
                    </>
                ) : (<Image height={133} width={146} alt={`${t('slot_alt')} ${props.index}`} src={`/images/slot_image_${props.index}.png`}></Image>)
            }
        </div>
    )
}

export default React.memo(CtSlot)
