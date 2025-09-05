'use client';

import React, { useRef, useEffect, useState } from 'react';
import style from '@/styles/battles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

import ScmCaseItem from '@/components/ScmCaseItem'

import 'swiper/css';

function BattleRouletteCnt(): React.ReactNode {

  const swiperRef = useRef<any>(null);
  const isSpinningRef = useRef(false);            // быстрый флаг для логики
  const [spinning, setSpinning] = useState(false); // чтобы обновлять props (allowTouchMove)
  const timeoutsRef = useRef<number[]>([]);
  const slides = Array.from({ length: 10 }, () => ({
    imgPath: "/images/example_gun_blue.png",
    gunModel: "AK-47",
    type: "usuall",
    gunStyle: "LIZARD PIZARD",
    gunPrice: 58.48,
  }));

  useEffect(() => {
    return () => {
      // очистка таймаутов при unmount
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

  /**
   * spinToSlide(targetIndex)
   * targetIndex: индекс (0..slides.length-1) слайда, на котором нужно остановиться
   * options.rounds — сколько полных кругов (по умолчанию 3..5 рандом)
   * options.minDuration / maxDuration — минимальная/максимальная длительность перехода (ms)
   */
  const spinToSlide = (
    targetIndex: number,
    options?: { rounds?: number; minDuration?: number; maxDuration?: number }
  ) => {
    if (!swiperRef.current || isSpinningRef.current) return;

    isSpinningRef.current = true;
    setSpinning(true);

    const slidesCount = slides.length;
    const rounds =
      options?.rounds ?? (2 + Math.floor(Math.random() * 2)); // 2-4 полных кругов по умолчанию
    const minDuration = options?.minDuration ?? 60; // быстрые шаги в начале
    const maxDuration = options?.maxDuration ?? 600; // медленные шаги в конце

    // используем realIndex (реальный индекс слайда без дублей)
    const currentReal = swiperRef.current.realIndex;
    const distance = (targetIndex - currentReal + slidesCount) % slidesCount;
    const totalSteps = rounds * slidesCount + distance;

    let cumulative = 0;

    for (let s = 0; s < totalSteps; s++) {
      // k от 0 до 1 — используется для "ease out" замедления
      const k = s / Math.max(1, totalSteps - 1);
      // квадратичная кривая (мягкое ускорение -> резкое замедление)
      const duration = Math.min(
        maxDuration,
        Math.round(minDuration + (maxDuration - minDuration) * (k * k))
      );

      // небольшой интервал между шагами дополнительно, чтобы не накладывать анимации
      const gap = 30;
      cumulative += duration + gap;

      const id = window.setTimeout(() => {
        if (!swiperRef.current) return;
        // slideNext с указанием длительности анимации
        swiperRef.current.slideNext(duration);

        // если последний шаг — завершаем спин
        if (s === totalSteps - 1) {
          // даём последней анимации отработать и сбрасываем флаги
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
    <div className={`${style.bstCntRoulet} bstCnt`}>
      <div className={style.swiperCnt}>
        <Swiper
          direction="vertical"
          slidesPerView={'auto'}
          autoHeight={false}
          loop={true} // важное — loop, чтобы не было резких "прыжков" к началу
          allowTouchMove={!spinning}
          className={style.brcSliderSwiper}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={40}
          centeredSlides={true}
        >
          {slides.map((value, num) => (
            <SwiperSlide className={style.battleSwiperSlide} key={num}>
              <div className={style.battleSwiperSlideContentCnt}>
                <ScmCaseItem imgPath={value.imgPath} gunModel={value.gunModel} type={value.type} gunStyle={value.gunStyle} gunPrice={value.gunPrice} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={() => {
            const target = Math.floor(Math.random() * slides.length);
            spinToSlide(target);
          }}
        >
          Spin random
        </button>

        <button onClick={() => spinToSlide(0)}>To slide 1</button>
        <button onClick={() => spinToSlide(slides.length - 1)}>To last</button>

        <button onClick={stopAll}>Stop</button>
      </div> */}
    </div>
  );
}

export default BattleRouletteCnt;
