import React from 'react'

import style from '@/styles/contracts.module.scss'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import CtSlotData from '@/components/CtSlotData'


interface GunData {
    gunModel: string
    gunStyle: string
    gunPrice: number
    imgPath: string
    type: "usuall" | "rare" | "elite" | "epic"
}

function CtSlot(props: { data: GunData, index: number }): React.ReactNode {

    const t = useTranslations('contracts');

    return (
        <div className={style.ctSlotCnt}>
            {
                props.data ? <CtSlotData data={props.data}></CtSlotData> : <Image height={133} width={146} alt={`${t('slot_alt')} ${props.index}`} src={`/images/slot_image_${props.index}.png`}></Image>
            }
        </div>
    )
}

export default CtSlot
