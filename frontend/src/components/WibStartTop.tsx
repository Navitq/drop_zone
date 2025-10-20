'use client'
import React, { useState } from 'react'
import style from '@/styles/winInventoryBlock.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

function WibStartTop(props: { isActive?: boolean, changeState: () => void }): React.ReactNode {
    const [sliderState, setSliderState] = useState<boolean>(false)
    const t = useTranslations("wibBlock")

    const changeSliderState = () => {
        setSliderState(state => !state)
    }

    const setNewState = () => {
        if (!props.isActive) {
            props.changeState()
        }
    }

    return (
        <div className={style.wolBlock}>
            <div onClick={changeSliderState} className={`${style.wolLiveBlock} ${style.wolStartBlock}`}>
                <div className={style.wolSliderStateIcon}>
                    <Image src={sliderState ? "/images/stop.svg" : "/images/play.svg"} alt={sliderState ? t('stop_alt') : t('play_alt')} fill></Image>
                </div>
                <div className={style.wolSliderStateText}>
                    {
                        t('start')
                    }
                </div>
            </div>
            <div onClick={setNewState} className={`${style.wolSliderTypeBtn} ${style.wolSliderTypeBtnCrown} ${props.isActive ? style.wolSliderTypeBtnActive : ""}`}>
                <div className={style.crownImageCnt}>
                    <Image fill src={'/images/crown.svg'} alt={t('crown_alt')} ></Image>
                </div>
                <div className={style.topSliderType}>
                    {t('top')}
                </div>
            </div>
        </div>
    )
}

export default WibStartTop
