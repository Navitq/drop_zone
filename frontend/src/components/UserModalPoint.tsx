import React from 'react'

import style from '@/styles/header.module.scss'

import Image from 'next/image'


interface UserModalPointInt {
    text: string;
    imgPath: string;
    imgAlt: string;
    width: number;
    height: number;
}

function UserModalPoint(props: UserModalPointInt) {
    return (
        <div className={style.userModalPoint}>
            <div className={style.userModalPointText}>{props.text}</div>
            <div className={style.userModalPointImgCnt}>
                <Image src={props.imgPath} alt={props.imgAlt} width={props.width} height={props.height}></Image>
            </div>
        </div>
    )
}

export default UserModalPoint
