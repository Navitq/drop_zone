import React from 'react'
import LogoNavPoint from '@/components/LogoNavPoint'
import style from '@/styles/header.module.scss'
import { FRONTEND_PATHS } from '@/utilites/urls'

function NavigatianMenu(): React.ReactNode {
    return (
        <nav className={style.navMenuCnt}>
            <LogoNavPoint linkPath={FRONTEND_PATHS.home} textKey={"nav_point_1"}
                altKey={"nav_image_alt_1"} path='/images/house.svg' pathSm={'/images/house_active.svg'} width={19} height={20} cntClass='navPointCnt' imgClass={'navImgSize'}></LogoNavPoint>
            <LogoNavPoint linkPath={FRONTEND_PATHS.contracts} textKey={"nav_point_2"}
                altKey={"nav_image_alt_2"} path='/images/luggage.svg' width={19} height={20} cntClass='navPointCnt' pathSm={'/images/luggage_active.svg'} imgClass={'navImgSize'}></LogoNavPoint>
            <LogoNavPoint linkPath={FRONTEND_PATHS.upgrades} textKey={"nav_point_3"}
                altKey={"nav_image_alt_3"} path='/images/arrow.svg' width={19} height={20} pathSm={'/images/arrow_active.svg'} cntClass='navPointCnt' imgClass={'navImgSize'}></LogoNavPoint>
            <LogoNavPoint linkPath={FRONTEND_PATHS.battles} textKey={"nav_point_4"}
                altKey={"nav_image_alt_4"} path='/images/shooting.svg' width={19} height={20} pathSm={'/images/shooting_active.svg'} cntClass='navPointCnt' imgClass={'navImgSize'}></LogoNavPoint>
            <LogoNavPoint linkPath={FRONTEND_PATHS.raffles} textKey={"nav_point_5"}
                altKey={"nav_image_alt_5"} pathSm={'/images/gift_active.svg'} path='/images/gift.svg' width={19} height={20} cntClass='navPointCnt' imgClass={'navImgSize'}></LogoNavPoint>
        </nav>
    )
}

export default NavigatianMenu
