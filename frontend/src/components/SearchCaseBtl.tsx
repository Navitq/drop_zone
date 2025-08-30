
import React from 'react'

import style from '@/styles/battles.module.scss'

function SearchCaseBtl(props: { placeHolderText: string }): React.ReactNode {
    return (
        <div className={style.btlSearchBlock}>
            <input className={style.btlSearchInput} type="text" placeholder={props.placeHolderText} ></input>
        </div>
    )
}

export default SearchCaseBtl
