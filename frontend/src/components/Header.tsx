import React from 'react'
import style from '@/styles/header.module.scss'

import LogoCnt from '@/components/LogoCnt'
import NavigatianMenu from '@/components/NavigatianMenu'
import HeaderUserInfo from '@/components/HeaderUserInfo'
import PaymentModal from '@/components/PaymentModal'
import Link from 'next/link'
import { FRONTEND_PATHS } from '@/utilites/urls'


function Header() {


    return (
        <header className={style.header}>
            <Link href={FRONTEND_PATHS.home} className={style.logoLink}>
                <div className={style.logoHeaderCntBg}>
                    <LogoCnt width={60} height={50} cntClass="logoCntMode" path="/images/head_logo.png" altKey={"daw"}></LogoCnt>
                </div>
                <div className={style.logoHeaderCntSm}>
                    <LogoCnt width={40} height={33} cntClass="logoCntMode" path="/images/head_logo.png" altKey={"daw"}></LogoCnt>
                </div>
            </Link>
            <div className={style.headerDataCnt}>
                <NavigatianMenu></NavigatianMenu>
                <HeaderUserInfo></HeaderUserInfo>

            </div>
            <PaymentModal></PaymentModal>
        </header>
    )
}

export default Header
