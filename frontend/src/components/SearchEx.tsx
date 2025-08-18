import React from 'react'

import style from '@/styles/upgrades.module.scss'

function SearchEx(props: { placeHolderText: string }): React.ReactNode {
    return (
        <div className={style.exSearchBlock}>
            <input className={style.exSearchInput} type="text" placeholder={props.placeHolderText} ></input>
        </div>
    )
}

export default SearchEx
