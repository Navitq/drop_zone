'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import style from '@/styles/battles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

import ScmCaseItem from '@/components/ScmCaseItem'

import 'swiper/css';
import { useAppSelector } from '@/lib/hooks';
import { steps } from 'motion';





interface ussualItemInt {
  case_id?: string
  icon_url: string
  id: string
  item_model: string
  item_style: string
  pk?: string
  price: number
  rarity: string,
  state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
}

interface WinnerCollectinItemInt {
  case_id: string,
  item: ussualItemInt
}
interface GunData {
  id: string,
  state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
  gunModel: string,
  gunStyle: string,
  gunPrice: number,
  imgPath: string,
  type: "usuall" | "rare" | "elite" | "epic" | "classified",
}
interface GunData {
  id: string,
  state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
  gunModel: string,
  gunStyle: string,
  gunPrice: number,
  imgPath: string,
  type: "usuall" | "rare" | "elite" | "epic" | "classified",
}



interface ussualItemIntFront {
  case_id?: string,
  imgPath: string,
  id: string,
  gunModel: string,
  gunStyle: string,
  gunPrice: number
  pk?: string,
  price: number,
  rarity: string,
  type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified',
  state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'
}


interface propsDataInt {
  playerData: WinnerCollectinItemInt | null,
  addElement: (elem: ussualItemIntFront) => void
}

function BattleRouletteCnt(props: propsDataInt): React.ReactNode {

  const swiperRef = useRef<any>(null);
  const isSpinningRef = useRef(false);            // быстрый флаг для логики
  const timeoutsRef = useRef<number[]>([]);
  const isClosetRef = useRef<boolean>(false)

  const activeCaseRoulleteItems = useAppSelector(state => state.activeBattle.activeCaseRoulleteItems);
  const slides = useMemo(() => {
    if (!activeCaseRoulleteItems || activeCaseRoulleteItems.length === 0) return [];

    const multiplier =
      activeCaseRoulleteItems.length <= 5
        ? 4
        : activeCaseRoulleteItems.length < 10
          ? 2
          : 1;
    return Array.from(
      { length: activeCaseRoulleteItems.length * multiplier },
      (_, i) => {
        const item = activeCaseRoulleteItems[i % activeCaseRoulleteItems.length];

        // 🟢 если это предмет игрока — заменяем gunPrice на props.playerData.item.price
        if (item.id === props.playerData?.item?.id) {
          return { ...item, gunPrice: props.playerData.item.price };
        }

        // иначе возвращаем как есть
        return item;
      }
    );
  }, [activeCaseRoulleteItems, props.playerData]);


  useEffect(() => {
    return () => {
      // очистка таймаутов при unmount
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
      isSpinningRef.current = false;
      isClosetRef.current = true;
    };
  }, [])


  useEffect(() => {

    if (
      !activeCaseRoulleteItems.length ||
      !props.playerData?.item?.id ||
      isSpinningRef.current
    )
      return;

    let checkInterval: any;

    const trySpin = () => {
      if (!swiperRef.current) return; // ждем инициализацию

      const endSlidePosition = activeCaseRoulleteItems.findIndex(
        (slide: any) => slide.id === props.playerData?.item.id
      );

      if (endSlidePosition === -1) return;
      spinToSlide(endSlidePosition, props.playerData?.item.id ? props.playerData?.item.id : "");

      clearInterval(checkInterval);
    };

    checkInterval = setInterval(trySpin, 100); // пробуем каждые 100ms

    return () => clearInterval(checkInterval);
  }, [activeCaseRoulleteItems]);


  if (activeCaseRoulleteItems.length == 0) {
    return null
  }



  // const spinToSlide = (
  //   targetIndex: number,
  //   options?: { rounds?: number; minDuration?: number; maxDuration?: number }
  // ) => {
  //   if (!swiperRef.current || isSpinningRef.current) return;
  //   isSpinningRef.current = true;

  //   const slidesCount = slides.length;
  //   const rounds = options?.rounds ?? 1;
  //   const minDuration = options?.minDuration ?? 200;
  //   const maxDuration = options?.maxDuration ?? 400;

  //   const currentReal = swiperRef.current.realIndex;
  //   const distance = (targetIndex - currentReal + slidesCount) % slidesCount;
  //   const totalSteps = rounds * slidesCount + distance;

  //   let cumulative = 0;

  //   for (let s = 0; s < totalSteps; s++) {
  //     const k = s / Math.max(1, totalSteps - 1);
  //     const duration = Math.min(
  //       maxDuration,
  //       Math.round(minDuration + (maxDuration - minDuration) * (k * k))
  //     );

  //     const gap = 30;
  //     cumulative += duration + gap;
  //     console.log(s)
  //     const id = window.setTimeout(() => {
  //       if (!swiperRef.current) return;
  //       swiperRef.current.slideNext(duration);

  //       if (s === totalSteps - 1) {
  //         const cleanup = window.setTimeout(() => {
  //           isSpinningRef.current = false;
  //         }, duration + 20);
  //         timeoutsRef.current.push(cleanup);

  //       }
  //     }, cumulative);

  //     timeoutsRef.current.push(id);
  //   }
  // };

  const spinToSlide = (target, targetId: string) => {
    if (!swiperRef.current || isSpinningRef.current) return;
    isSpinningRef.current = true;

    const minDuration = 0;
    const maxDuration = 200;
    let step = 0;
    const totalStepsRollet = slides.length * 2 + target; // минимум 30 шагов
    const moveStep = () => {


      if (!swiperRef.current || isClosetRef.current) return;

      const currentIndex = swiperRef.current.realIndex;

      // безопасная проверка
      if (currentIndex === undefined || !slides[currentIndex]) {
        setTimeout(moveStep, minDuration);

        return;
      }

      const currentSlide = slides[currentIndex];
      // Если нашли нужный слайд после мин. количества шагов
      if (step >= totalStepsRollet && currentSlide.id === targetId) {
        isSpinningRef.current = false;
        props.addElement(currentSlide);
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
    <div className={`${style.bstCntRoulet} bstCnt`}>
      <div className={style.swiperCnt}>
        <Swiper
          direction="vertical"
          slidesPerView={'auto'}
          autoHeight={false}
          loop={true} // важное — loop, чтобы не было резких "прыжков" к началу
          allowTouchMove={false}
          className={style.brcSliderSwiper}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          centeredSlides={true}
          spaceBetween={25} // значение для экранов <= 1024px
          breakpoints={{
            1025: {
              spaceBetween: 40, // для экранов > 1024px
            },
          }}
        >
          {slides.map((value, num) => (
            <SwiperSlide className={style.battleSwiperSlide} key={num}>
              <div className={style.battleSwiperSlideContentCnt}>
                <ScmCaseItem state={value.state} imgPath={value.imgPath} gunModel={value.gunModel} type={value.type} gunStyle={value.gunStyle} gunPrice={value.gunPrice} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


    </div>
  );
}

export default React.memo(BattleRouletteCnt);
