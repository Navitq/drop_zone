import React from 'react'
import style from '@/styles/homePage.module.scss'

interface SmallBilboardInt {
    title: string,
    subTitle: string,
    btnTitle?: string
}

function SmallBilboard(props: SmallBilboardInt) {
    return (
        <div className={style.smbdBlock}>
            <div className={style.smbdTitle}>{props.title}</div>
            <div className={style.smbdSubTitle}>{props.subTitle}</div>
            <div className={style.smbdBtnTitleCnt}>
                <button  className={style.smbdBtnTitle}>{props.btnTitle}</button>
            </div>
        </div>
    )
}

export default SmallBilboard
