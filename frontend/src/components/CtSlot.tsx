import React from 'react'

import style from '@/styles/contracts.module.scss'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import CtSlotData from '@/components/CtSlotData'
import { data } from 'motion/react-client'

import isEqual from 'lodash.isequal';

interface GunData {
    id: string,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

interface ussualItemIntFront {
    case_id?: string,
    imgPath: string,
    id: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number
    pk?: string,
    price: string,
    rarity: string,
    type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified',
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
}

function CtSlot(props: { data?: GunData | ussualItemIntFront, index: number, click?: () => void, }): React.ReactNode {

    const t = useTranslations('contracts');
    console.log(data)
    return (
        <div className={`${style.ctSlotCnt} ${'contractsSlotGlobal'}`} onClick={() => { props.click?.() }}>
            {
                props.data && props.click ? (
                    <>
                        <div className={style.ctSlotCntHover}>
                            <div className={style.ctSlotCntHoverCross}></div>
                        </div>
                        <CtSlotData data={props.data}></CtSlotData>
                    </>
                ) : (<><Image className={style.mobileCtSlotImage} height={58} width={63} alt={`${t('slot_alt')} ${props.index}`} src={`/images/slot_image_${props.index}.png`}></Image><Image className={style.pcCtSlotImage} height={133} width={146} alt={`${t('slot_alt')} ${props.index}`} src={`/images/slot_image_${props.index}.png`}></Image></>)
            }
        </div>
    )
}

export default React.memo(CtSlot, (prevProps, nextProps) => isEqual(prevProps, nextProps));
