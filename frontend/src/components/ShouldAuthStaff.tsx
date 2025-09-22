import React from 'react'
import style from '@/styles/upgrades.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import Link from 'next/link'

interface ShouldAuthStaffInt {
    btnText: string,
    titleText: string,
    subTitleText?: string,
    linkTo?: string,
}

function ShouldAuthStaff(props: ShouldAuthStaffInt) {
    return (
        <div className={style.sasCnt}>
            <div className={style.sasBlock}>
                <div className={style.sasTextBlock}>
                    <div className={style.sasTitle}>{props.titleText}</div>
                    {
                        props.subTitleText ? <div className={style.sasTitle}>{props.subTitleText}</div> : ""
                    }
                </div>
                <Link href={props.linkTo ? props.linkTo : "#header"}>
                    <CaseBtnText text={props.btnText} onClick={() => { return }}></CaseBtnText>
                </Link>
            </div>
        </div>
    )
}

export default ShouldAuthStaff
