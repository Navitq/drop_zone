'use client'
import React, { useEffect, useState, useMemo } from 'react'

import style from '@/styles/homePage.module.scss'
import BdTimerCell from '@/components/BdTimerCell'
import { useTranslations } from 'next-intl'

function BdTime(props: { seconds: number }) {
    const [remainingSeconds, setRemainingSeconds] = useState(props.seconds)

    useEffect(() => {
        if (remainingSeconds <= 0) return

        const interval = setInterval(() => {
            setRemainingSeconds(prev => (prev > 0 ? prev - 60 : 0))
        }, 60000)

        return () => clearInterval(interval)
    }, [remainingSeconds])

    // Вычисляем дни, часы и минуты из оставшегося времени
    // Меморизация дней — пересчитываем только если дни изменились
    const days = useMemo(() => {
        return Math.floor(remainingSeconds / (24 * 3600))
    }, [remainingSeconds])

    // Меморизация часов — пересчитываем только если часы изменились
    const hours = useMemo(() => {
        return Math.floor((remainingSeconds % (24 * 3600)) / 3600)
    }, [remainingSeconds])

    // Меморизация минут — пересчитываем только если минуты изменились
    const minutes = useMemo(() => {
        return Math.floor((remainingSeconds % 3600) / 60)
    }, [remainingSeconds])


    const t = useTranslations("homePage")
    return (
        <div className={style.bdTimerCnt}>
            <BdTimerCell data={days} type={t('bd_day')}></BdTimerCell>
            <BdTimerCell data={hours} type={t('bd_hours')}></BdTimerCell>
            <BdTimerCell data={minutes} type={t('bd_minutes')}></BdTimerCell>
        </div>
    )
}

export default BdTime
