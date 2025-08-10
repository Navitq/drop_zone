import React from 'react'
import style from '@/styles/homePage.module.scss'

import Bilboard from '@/components/Bilboard'
import SmallBilboard from '@/components/SmallBilboard'

function AdvertisementBlock(): React.ReactNode {
    return (
        <div className={style.advertisementCnt}>
            <Bilboard seconds={10001} subTitle={'Успей выбить легендарный скин до конца недели!'} title={'АК-47 Топливный инжектор'} butText={"text daw"} classPosition={"bd_left"} time={true} imgUrl={'/images/bd_ak.png'}></Bilboard>
            <SmallBilboard title={'Ивенты'} subTitle={"Каждый ивент — шанс забрать топовые скины и бонусы!"} btnTitle={"перейти"}></SmallBilboard>
            <Bilboard subTitle={'Заходи в Апгрейд и выбивай скины!'} title={'Обновите инвентарь'} butText={"text daw"} imgUrl={'/images/bd_bomb.png'}></Bilboard>
        </div >
    )
}

export default AdvertisementBlock
