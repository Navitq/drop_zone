import React from 'react'
import style from "@/styles/modal.module.scss"
import Image from 'next/image'

interface PmwMenuItem {
    imgPath?: string;
    alt?: string;
    text: string
}

export default function PmwMenuItem(props: PmwMenuItem): React.ReactNode {
    return (
        <div className={style.pmwMenuItem}>
            {props.imgPath && props.alt ? (<div className={style.pmwMenuImgCnt}>
                <Image src={props.imgPath} alt={props.alt} width={12} height={13}></Image>
            </div>) : ""}
            <div className={style.pmwMenuText}>{props.text}</div>
        </div>
    )
}
