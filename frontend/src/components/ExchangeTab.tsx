import React from 'react'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface ExchangeTabInt {
    imageUrl: string,
    altKey: string,
    width: number,
    height: number,
    textKey: string,
}

function ExchangeTab(props: ExchangeTabInt): React.ReactNode {
    const t = useTranslations('upgrade')
    return (
        <div>
            <div>
                <Image width={props.width} height={props.height} src={props.imageUrl} alt={props.altKey}></Image>
            </div>
            <div>{props.textKey}</div>
        </div>
    )
}

export default ExchangeTab
