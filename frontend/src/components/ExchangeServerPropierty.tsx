import React from 'react'

import style from '@/styles/upgrades.module.scss'
import { useTranslations } from 'next-intl'

import ExBlockTitle from '@/components/ExBlockTitle'
import SearchEx from '@/components/SearchEx'
import SearchByPrice from '@/components/SearchByPrice'
import ExClientStuffs from '@/components/ExClientStuffs'


function ExchangeServerPropierty(): React.ReactNode {
    const t = useTranslations('upgrades')
    return (
        <div className={style.clientBlock}>
            <div className={style.serverInfoBlock}>
                <div className={style.serverExTitle}>
                    <ExBlockTitle title={t('get_our_skins')}></ExBlockTitle>
                </div>
                <div className={style.exServerSearch}>
                    <SearchEx placeHolderText={t('search_by_data')}></SearchEx>
                    <SearchByPrice placeHolderText={t('search_by_price')}></SearchByPrice>
                </div>
            </div>
            <ExClientStuffs ></ExClientStuffs>
        </div>
    )
}

export default ExchangeServerPropierty
