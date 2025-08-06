import React from 'react'
import style from '@/styles/header.module.scss'

import LogoCnt from '@/components/LogoCnt'
import NavigatianMenu from '@/components/NavigatianMenu'
import HeaderUserInfo from '@/components/HeaderUserInfo'


function Header() {


    return (
        <header className={style.header}>
            <LogoCnt width={60} height={50} cntClass="logoCntMode" path="/images/head_logo.png" altKey={"daw"}></LogoCnt>
            <div className={style.headerDataCnt}>
                <NavigatianMenu></NavigatianMenu>
                <HeaderUserInfo></HeaderUserInfo>

            </div>

        </header>
    )
}

export default Header
