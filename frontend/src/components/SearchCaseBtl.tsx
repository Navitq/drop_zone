
import React from 'react'

import style from '@/styles/battles.module.scss'

function SearchCaseBtl(props: { placeHolderText: string, inputValue: string, onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void }): React.ReactNode {

    return (
        <div className={style.btlSearchBlock}>
            <input value={props.inputValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { props.onChangeName(e) }} className={style.btlSearchInput} type="text" placeholder={props.placeHolderText} ></input>
        </div>
    )
}

export default SearchCaseBtl
