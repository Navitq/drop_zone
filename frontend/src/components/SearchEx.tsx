import React from 'react'

import style from '@/styles/upgrades.module.scss'

function SearchEx(props: { placeHolderText: string, searchDara: string, handler: (value: string) => void }): React.ReactNode {

    return (
        <div className={style.exSearchBlock}>
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { props.handler(e.target.value) }} value={props.searchDara} className={style.exSearchInput} type="text" placeholder={props.placeHolderText} ></input>
        </div>
    )
}

export default SearchEx
