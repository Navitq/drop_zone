'use client'
import React, { useMemo } from 'react'

import style from '@/styles/contracts.module.scss'

import CtSlot from '@/components/CtSlot'
import { useAppSelector } from '@/lib/hooks'
import { useDispatch } from 'react-redux'
import { removeClientItemData } from '@/redux/contractsReducer'

interface GunData {
    id: string,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

// Главный компонент
function CtScinsSlots() {
    const dispatch = useDispatch()
    const itemClientData = useAppSelector(state => state.contracts.itemClientData)
    const slots = Array.from({ length: 10 }, (_, i) => itemClientData[i] || null);

    // Массив длиной 10, создаём только при изменении items
    function removeItem(id: string) {
        dispatch(removeClientItemData(id))
    }

    return (
        <div className={style.ctObjectCnt}>
            {slots.map(function (item, index) {
                if (item) {
                    return <CtSlot click={() => { removeItem(item.id) }} key={item?.id || index} data={{ imgPath: item.imgPath, gunModel: item.gunModel, type: item.type, gunStyle: item.gunStyle, gunPrice: item.gunPrice, state: item.state }} index={index} />;
                } else {
                    return <CtSlot key={index} index={index} />;
                }

            })}
        </div>
    );
}


export default CtScinsSlots;
