'use client';
import React from 'react';
// import style from '@/styles/battles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function BattleRouletteCnt(): JSX.Element {
  return (
    <div className="bstCnt">
      <div className="swiperCnt">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          autoHeight={false}
          className="brcSliderSwiper"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <SwiperSlide key={i}>Slide {i + 1}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default BattleRouletteCnt;
