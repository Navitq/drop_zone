import React from 'react'
import style from '@/styles/header.module.scss'
import Image from 'next/image'

function Header() {
    return (
        <header className={style.header}>
            <div className={style.logoCnt}>
                <Image></Image>
            </div>
            <nav>
            </nav>

        </header>
    )
}

export default Header
