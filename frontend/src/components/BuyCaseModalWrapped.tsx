'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import style from '@/styles/modal.module.scss';
import { Virtual } from 'swiper/modules';
import ScmCaseItem from '@/components/ScmCaseItem';
import Image from 'next/image';
import style_two from '@/styles/itemStyle.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import BattleModalBtn from '@/components/BattleModalBtn'

import 'swiper/css';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/hooks';
import { motion } from "motion/react"

function BuyCaseModalWrapped({ close }: { close: () => void }): React.ReactNode {
    const swiperRef = useRef<any>(null);
    const isSpinningRef = useRef(false);
    const timeoutsRef = useRef<number[]>([]);
    const t = useTranslations("homePage")
    const [showPrize, setShowPrize] = useState(false);
    const isClosetRef = useRef<boolean>(false)

    const { caseName, items, prize_index, prize_item } = useAppSelector(state => state.modal.rulletCaseModal)
    // 👉 базовый массив предметов

    // 👉 размножаем массив, чтобы Swiper был заполнен (например, до 100 элементов)
    const slides = useMemo(() => {
        if (!items || items.length === 0) return [];

        const multiplier =
            items.length <= 5
                ? 4
                : items.length < 10
                    ? 2
                    : 1;

        const totalLength = Math.max(items.length * multiplier, 30);

        return Array.from(
            { length: totalLength },
            (_, i) => items[i % items.length]
        );
    }, [items]);


    useEffect(() => {
        if (prize_index < 0) {
            return;
        }
        spinToSlide(prize_index, items[prize_index].id)
    }, [prize_index]);


    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((id) => clearTimeout(id));
            timeoutsRef.current = [];
            isSpinningRef.current = false;
            isClosetRef.current = true;
        };
    }, []);

    const stopAll = () => {
        timeoutsRef.current.forEach((id) => clearTimeout(id));
        timeoutsRef.current = [];
        isSpinningRef.current = false;
    };

    // const spinToSlide = (
    //     targetIndex: number,
    //     options?: { rounds?: number; minDuration?: number; maxDuration?: number }
    // ) => {
    //     if (!swiperRef.current || isSpinningRef.current) return;
    //     isSpinningRef.current = true;

    //     const slidesCount = slides.length;
    //     const rounds = options?.rounds ?? 1;
    //     const minDuration = options?.minDuration ?? 60;
    //     const maxDuration = options?.maxDuration ?? 400;

    //     const currentReal = swiperRef.current.realIndex;
    //     const distance = (targetIndex - currentReal + slidesCount) % slidesCount;
    //     const totalSteps = rounds * slidesCount + distance;

    //     let cumulative = 0;

    //     for (let s = 0; s < totalSteps; s++) {
    //         const k = s / Math.max(1, totalSteps - 1);
    //         const duration = Math.min(
    //             maxDuration,
    //             Math.round(minDuration + (maxDuration - minDuration) * (k * k))
    //         );

    //         const gap = 30;
    //         cumulative += duration + gap;

    //         const id = window.setTimeout(() => {
    //             if (!swiperRef.current) return;
    //             swiperRef.current.slideNext(duration);

    //             if (s === totalSteps - 1) {
    //                 const cleanup = window.setTimeout(() => {
    //                     isSpinningRef.current = false;
    //                 }, duration + 20);
    //                 timeoutsRef.current.push(cleanup);
    //                 setTimeout(() => { setShowPrize(true) }, 500)
    //             }
    //         }, cumulative);

    //         timeoutsRef.current.push(id);
    //     }
    // };

    const spinToSlide = (target: number, targetId: string) => {
        if (!swiperRef.current || isSpinningRef.current) return;
        isSpinningRef.current = true;

        const minDuration = 0;
        const maxDuration = 200;
        let step = 0;

        const totalStepsRollet = slides.length * 2 + target; // минимум 30 шагов
        console.log()
        const moveStep = () => {
            console.log(targetId, 777777777)

            if (!swiperRef.current || isClosetRef.current) return;

            const currentIndex = swiperRef.current.realIndex;
            console.log(targetId, 666666666)

            // безопасная проверка
            if (currentIndex === undefined || !slides[currentIndex]) {
                console.log(2222)
                setTimeout(moveStep, minDuration);
                return;
            }

            const currentSlide = slides[currentIndex];
            console.log(currentSlide.id, targetId, 6555555)
            // Если нашли нужный слайд после мин. количества шагов
            if (step >= totalStepsRollet && currentSlide.id === targetId) {
                isSpinningRef.current = false;
                setTimeout(() => { setShowPrize(true) }, 500)
                return;
            }

            step++;
            const duration = Math.round(
                minDuration + (maxDuration - minDuration) * Math.pow(step / totalStepsRollet, 2)
            );

            swiperRef.current.slideNext(duration);
            const id = window.setTimeout(moveStep, duration);
            timeoutsRef.current.push(id);
        };

        moveStep();
    };



    return (
        <div className={`${style.bcmwCnt} bcmwCnt`} onClick={(e) => e.stopPropagation()}>
            <div className={style.bcmwCaseData}>
                <div className={style.bcmwCaseName}>{caseName}</div>
                <div className={`${style.bcmwCaseArrow} ${style.bcmwCaseArrowTop}`}>
                </div>
            </div>
            <div className={style.bcmwSwiperCnt}>
                <Swiper
                    direction="horizontal"
                    slidesPerView={"auto"}
                    autoHeight={false}
                    loop={true}
                    allowTouchMove={false}
                    className={style.bcmwSliderSwiper}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    spaceBetween={3}
                    centeredSlides={true}

                >

                    {slides.map((value, num) => (
                        <SwiperSlide className={style.bcmwSwiperSlide} key={num}>
                            <div className={style.bcmwSwiperSlideContentCnt}>
                                <ScmCaseItem
                                    imgPath={value.imgPath}
                                    gunModel={value.gunModel}
                                    type={value.type}
                                    gunStyle={value.gunStyle}
                                    gunPrice={value.gunPrice}
                                    state={value.state}
                                />
                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
            <div className={`${style.bcmwCaseData} ${style.bcmwCaseArrowCnt}`}>
                <div className={`${style.bcmwCaseArrow} ${style.bcmwCaseArrowBottom}`}>
                </div>
            </div>
            {showPrize && (
                <motion.div
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    transition={{ duration: 2.0, ease: "easeOut" }}

                >
                    <div className={`${style.wonGunInfo} ${style_two[`${prize_item?.type}ScmCaseItem`]} ${style_two.scmCaseRoulletItem} wonGunInfo`}>
                        <div className={style_two.scmCaseGunModel}>{prize_item?.gunModel} |</div>
                        <div className={`${style_two.smItemGunStyle} ${style_two.smItemGunStyleRoullet}`}>{prize_item?.gunStyle}</div>
                    </div>
                    <div className={style.wonGunBttn}>
                        <div className={style.wonGunBttnTake}>
                            <CaseBtnText text={t('take')} />
                        </div>
                        <BattleModalBtn text={t('sell')} />
                    </div>
                </motion.div>
            )}



            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                    onClick={() => {
                        const target = Math.floor(Math.random() * slides.length);
                        spinToSlide(target);
                    }}
                >
                    Spin random
                </button>

                {/* <button onClick={() => spinToSlide(0)}>To slide 1</button>
                <button onClick={() => spinToSlide(slides.length - 1)}>To last</button>

                <button onClick={stopAll}>Stop</button> */}
            </div>
        </div>
    );
}

export default BuyCaseModalWrapped;
