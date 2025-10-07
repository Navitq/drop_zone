'use client'
import React, { useRef, useEffect } from 'react'

import CbhGameActiveCases from '@/components/CbhGameActiveCases'
import { useAppSelector } from '@/lib/hooks'
import { useLocale, useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css';

import style from '@/styles/battles.module.scss'

function CbhMobileGameState(): React.ReactNode {
    const cases = useAppSelector(state => state.activeBattle.cases)
    const active_round = useAppSelector(state => state.activeBattle.active_round)
    const isGameFinished = useAppSelector(state => state.activeBattle.isGameFinished)
    const locale = useLocale()
    const t = useTranslations("battles")

    const swiperRef = useRef<SwiperType | null>(null)

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(active_round, 500) // переход к нужному слайду
        }
    }, [active_round])

    useEffect(() => {
        if (swiperRef.current && isGameFinished) {
            const lastSlideIndex = swiperRef.current.slides.length - 1
            swiperRef.current.slideTo(lastSlideIndex, 500) // плавный переход на конец
        }
    }, [isGameFinished])

    return (
        <div>
            <Swiper
                direction="vertical"
                slidesPerView={'auto'}
                autoHeight={false}
                allowTouchMove={false}
                className={style.cbhSliderSwiper}
                spaceBetween={10}
                centeredSlides={true}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                    0: {           // для экранов >= 0px
                        slidesPerView: 1.6,
                    },
                    769: {         // для экранов >= 769px
                        slidesPerView: 'auto', // обычное поведение
                    },
                }}

            >
                <SwiperSlide className={style.cbhSwiperSlide} key={-1}>
                    <div className={style.cbhGameState}>
                        <div>{t('expectation')}</div>
                        <div>{t('participants')}</div>
                    </div>
                </SwiperSlide>
                {
                    cases.flatMap((value, index) => {
                        return Array.from({ length: value.case_amount }, (_, i) => {
                            const globalIndex = index + i // если нужно общее смещение, можно адаптировать формулу

                            return (
                                <SwiperSlide className={style.cbhSwiperSlide} key={globalIndex}>
                                    <CbhGameActiveCases
                                        key={`${value.id}-${i}`}
                                        activeId={
                                            globalIndex > -1 && globalIndex < 3
                                                ? ((globalIndex + 1) as 0 | 1 | 2 | 3)
                                                : 0
                                        }
                                        caseImgPath={value.imgpath}
                                        caseName={value.name[locale as 'en' | 'ru']}
                                        casesId={value.id}
                                    />
                                </SwiperSlide>
                            )
                        })
                    })
                }
                <SwiperSlide className={style.cbhSwiperSlide} key={-2}>
                    <div className={style.cbhGameState}>
                        <div>{t('battle')}</div>
                        <div>{t('finished')}</div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>

    )
}

export default CbhMobileGameState
