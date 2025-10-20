'use client'
import React, { useEffect, useState } from 'react'
import style from '@/styles/winInventoryBlock.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

function WibOnlineLive(props: { onlineUserAmount?: number, isActive?: boolean, changeState: () => void }): React.ReactNode {
    const [blick, setBlick] = useState<boolean>(true)
    const t = useTranslations("wibBlock")

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
            <div onClick={setNewState} className={`${style.wolSliderTypeBtn} ${!props.isActive ? style.wolSliderTypeBtnActive : ""}`}>
                Live
            </div>
        </div>
    )
}

export default WibOnlineLive
