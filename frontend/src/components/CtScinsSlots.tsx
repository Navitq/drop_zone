'use client'
import React, { useMemo } from 'react'

import style from '@/styles/contracts.module.scss'

import CtSlot from '@/components/CtSlot'
import { useAppSelector } from '@/lib/hooks'
import { useDispatch } from 'react-redux'
import { removeClientItemData, removeWonItem } from '@/redux/contractsReducer'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

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
    const newItem = useAppSelector(state => state.contracts.contractsFinished.newItem)
    const slots = Array.from({ length: 10 }, (_, i) => itemClientData[i] || null);
    const t = useTranslations("contracts")
    // Массив длиной 10, создаём только при изменении items

    function removeItem(id: string) {
        dispatch(removeClientItemData(id))
    }

    function takeWonItem() {
        dispatch(removeWonItem())
    }

    function removeWonItemLocal() {
        dispatch(removeWonItem())
    }

    return (
        <>

            {newItem.id ? (<div className={`${style.ctObjectPrizeCnt} ${style[newItem.type + 'CtObjectPrizeCnt']}`}>
                <div className={style.cssItemInfoCnt}>
                    <div className={style.cssGunInfoCnt}>
                        <div className={style.cssGunModel}>{`${newItem.gunModel} `}&nbsp;&nbsp;|&nbsp;</div>
                        <div className={style.cssGunStyle}>{newItem.gunStyle}</div>
                    </div>
                </div>
                <div className={style.cssPriseImgInfoCnt}>
                    <div className={style.cssItemPrice}>{newItem.gunPrice} Dc</div>
                    <div className={style.cssItemImgCnt}>
                        <Image fill src={newItem.imgPath} alt={`${newItem.gunModel}  | ${newItem.gunStyle}`}></Image>
                    </div>
                </div>
                <div className={style.cssBtnCollection}>
                    <div className={style.cssTakeBtn} onClick={() => { takeWonItem() }}>
                        {t('take_item')}
                    </div>
                    <div className={style.cssSellBtn} onClick={() => { removeWonItemLocal() }}>
                        {t('sell_item')}
                    </div>
                </div>
            </div>) : (
                <div className={style.ctObjectCnt}>
                    {slots.map(function (item, index) {
                        if (item) {
                            return <CtSlot click={() => { removeItem(item.id) }} key={item?.id || index} data={{ imgPath: item.imgPath, gunModel: item.gunModel, type: item.type, gunStyle: item.gunStyle, gunPrice: item.gunPrice, state: item.state }} index={index} />;
                        } else {
                            return <CtSlot key={index} index={index} />;
                        }

                    })}
                </div>
            )}
        </>
    );
}


export default CtScinsSlots;
