import React from 'react'
import style from '@/styles/cases.module.scss'

export default function CaseName(props: { caseName: string }): React.ReactNode {
    return (
        <div className={style.caseName}>{props.caseName}</div>
    )
}
