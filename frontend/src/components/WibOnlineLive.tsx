'use client'
import React, { useEffect, useState, useRef } from 'react'
import style from '@/styles/winInventoryBlock.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setTopActiveState } from '@/redux/dropSliderReducer'

function WibOnlineLive(props: { onlineUserAmount?: number, isActive?: boolean, changeState: () => void }): React.ReactNode {
    const [blick, setBlick] = useState<boolean>(true)
    const t = useTranslations("wibBlock")
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const isTopActive = useAppSelector(state => state.dropSlider.isTopActive)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const intervalData = setInterval(() => {
            setBlick(prev => !prev)
        }, 900)
        return () => clearInterval(intervalData)
    }, [])

    const setNewState = () => {
        if (props.isActive) {
            props.changeState()
        }
    }
    const changeState = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
            dispatch(setTopActiveState(!isTopActive))
        }, 200)
    }

    return (
        <div className={style.wolBlock}>
            <div className={style.wolLiveBlock}>
                <div className={style.wolLiveImgCnt}>
                    <Image src={blick ? '/images/passive_locator.svg' : '/images/active_locator.svg'} fill alt={blick ? t('passive_locator_alt') : t('active_locator_alt')}></Image>
                </div>
                <div className={style.wolLiveInfoData}>
                    <div className={style.wolOnlineAmount}>{props.onlineUserAmount ? props.onlineUserAmount : 0}</div>
                    <div className={style.wolOnlineTxt}>online</div>
                </div>
            </div>
            <div onClick={setNewState} className={`${style.wolSliderTypeBtn} ${!props.isActive ? style.wolSliderTypeBtnActive : ""} ${style.wolSliderTypeBtnPc}`}>
                Live
            </div>
            <div onClick={changeState} className={`${style.wolSliderTypeBtn} ${style.wolSliderTypeBtnActive} ${style.wolSliderTypeBtnMobile}`}>
                {isTopActive ? t('top') : 'Live'}
            </div>
        </div>
    )
}

export default WibOnlineLive
