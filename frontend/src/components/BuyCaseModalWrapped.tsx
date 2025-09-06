'use client';

import React, { useRef, useEffect, useState } from 'react';
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

function BuyCaseModalWrapped({ close }: { close: () => void }): React.ReactNode {
    const swiperRef = useRef<any>(null);
    const isSpinningRef = useRef(false);
    const [spinning, setSpinning] = useState(false);
    const timeoutsRef = useRef<number[]>([]);
    const t = useTranslations("homePage")

    // 👉 базовый массив предметов
    const baseSlides = [
        { imgPath: "/images/example_gun_blue.png", gunModel: "AK-47", type: "usuall", gunStyle: "STYLE 1", gunPrice: 10.25 },
        { imgPath: "/images/example_gun_blue.png", gunModel: "M4A1", type: "rare", gunStyle: "STYLE 2", gunPrice: 20.50 },
        { imgPath: "/images/example_gun_blue.png", gunModel: "AWP", type: "elite", gunStyle: "STYLE 3", gunPrice: 35.75 },
        { imgPath: "/images/example_gun_blue.png", gunModel: "Glock", type: "epic", gunStyle: "STYLE 4", gunPrice: 50.00 },
        { imgPath: "/images/example_gun_blue.png", gunModel: "Deagle", type: "classified", gunStyle: "STYLE 5", gunPrice: 75.00 },
    ];

    // 👉 размножаем массив, чтобы Swiper был заполнен (например, до 100 элементов)
    const slides = Array.from({ length: 20 }, (_, i) => baseSlides[i % baseSlides.length]);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((id) => clearTimeout(id));
            timeoutsRef.current = [];
            isSpinningRef.current = false;
            setSpinning(false);
        };
    }, []);

    const stopAll = () => {
        timeoutsRef.current.forEach((id) => clearTimeout(id));
        timeoutsRef.current = [];
        isSpinningRef.current = false;
        setSpinning(false);
    };

    const spinToSlide = (
        targetIndex: number,
        options?: { rounds?: number; minDuration?: number; maxDuration?: number }
    ) => {
        if (!swiperRef.current || isSpinningRef.current) return;

        isSpinningRef.current = true;
        setSpinning(true);

        const slidesCount = slides.length;
        const rounds = options?.rounds ?? (2 + Math.floor(Math.random() * 2));
        const minDuration = options?.minDuration ?? 60;
        const maxDuration = options?.maxDuration ?? 600;

        const currentReal = swiperRef.current.realIndex;
        const distance = (targetIndex - currentReal + slidesCount) % slidesCount;
        const totalSteps = rounds * slidesCount + distance;

        let cumulative = 0;

        for (let s = 0; s < totalSteps; s++) {
            const k = s / Math.max(1, totalSteps - 1);
            const duration = Math.min(
                maxDuration,
                Math.round(minDuration + (maxDuration - minDuration) * (k * k))
            );

            const gap = 30;
            cumulative += duration + gap;

            const id = window.setTimeout(() => {
                if (!swiperRef.current) return;
                swiperRef.current.slideNext(duration);

                if (s === totalSteps - 1) {
                    const cleanup = window.setTimeout(() => {
                        isSpinningRef.current = false;
                        setSpinning(false);
                    }, duration + 20);
                    timeoutsRef.current.push(cleanup);
                }
            }, cumulative);

            timeoutsRef.current.push(id);
        }
    };

    return (
        <div className={`${style.bcmwCnt} bcmwCnt`} onClick={(e) => e.stopPropagation()}>
            <div className={style.bcmwCaseData}>
                <div className={style.bcmwCaseName}>Some case name</div>
                <div className={style.bcmwCaseArrow}>
                    <Image fill src={"/images/down_direction_case_arrow.svg"} alt={t("top_arrow_choice_alt")}></Image>
                </div>
            </div>
            <div className={style.bcmwSwiperCnt}>
                <Swiper
                    direction="horizontal"
                    slidesPerView={"auto"}
                    autoHeight={false}
                    loop={true}
                    allowTouchMove={!spinning}
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
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className={`${style.bcmwCaseData} ${style.bcmwCaseArrowCnt}`}>
                <div className={style.bcmwCaseArrow}>
                    <Image fill src={"/images/top_direction_case_arrow.svg"} alt={t("top_arrow_choice_alt")}></Image>
                </div>
            </div>
            <div className={`${style.wonGunInfo} ${style_two.usuallScmCaseItem} ${style_two.scmCaseRoulletItem}`}>
                <div className={style_two.scmCaseGunModel}>М4А1 | </div>
                <div className={style_two.smItemGunStyle}>Some gun style</div>
            </div>
            <div className={style.wonGunBttn}>
                <div className={style.wonGunBttnTake}>
                    <CaseBtnText text={t('take')}></CaseBtnText>
                </div>
                <BattleModalBtn text={t('sell')}></BattleModalBtn>
            </div>



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
