import React from 'react'
import style from '@/styles/profile.module.scss'

function PrStaffTitle(props: { text: string }): React.ReactNode {
    return (
        <div className={style.prStaffTitle}>{props.text}</div>
    )
}

export default PrStaffTitle
