'use client'
import React from 'react'
import style from '@/styles/winInventoryBlock.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSliderRunState } from '@/redux/dropSliderReducer'

function WibStartTop(props: { isActive?: boolean, changeState: () => void }): React.ReactNode {
    const dispatch = useAppDispatch()
    const isSliderRun = useAppSelector(state => state.dropSlider.isSliderRun)
    const t = useTranslations("wibBlock")

    const changeSliderState = () => {
        console.log(1123)
        dispatch(setSliderRunState(!isSliderRun))
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
                    <Image src={isSliderRun ? "/images/stop.svg" : "/images/play.svg"} alt={isSliderRun ? t('stop_alt') : t('play_alt')} fill></Image>
                </div>
                <div className={style.wolSliderStateText}>
                    {
                        isSliderRun ? t('stop') : t('start')
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
