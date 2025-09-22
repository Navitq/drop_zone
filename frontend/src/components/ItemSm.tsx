import React, { useCallback } from 'react'
import style from '@/styles/itemStyle.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ItemBtn from '@/components/ItemBtn'

interface ItemSmInt {
    activateBtnColor?: boolean
    id: string
    gunModel: string
    gunStyle: string
    gunPrice: number
    imgPath: string
    type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified'
    state: string
    activateBtn: () => void
}

function ItemSm(props: ItemSmInt): React.ReactNode {
    const t = useTranslations('items')

    // мемоизируем колбэк, чтобы не создавать новую функцию
    const handleActivate = useCallback(() => {
        props.activateBtn()
    }, [props.activateBtn])

    return (
        <div className={`${style.smItemCnt} ${style[props.type + 'ItemSmType']}`}>
            <div className={style.smItemImgCnt}>
                <Image
                    fill
                    alt={`${props.gunModel}, ${props.gunStyle}`}
                    src={props.imgPath}
                    className={style.smItemImg}
                />
            </div>
            <div className={style.smItemInfoBlck}>
                <div className={style.smItemInfoCnt}>
                    <div className={style.smItemGunModel}>{`${props.gunModel} |`}</div>
                    <div className={style.smItemGunStyle}>{props.gunStyle}</div>
                </div>
                <div className={style.smItemGunPrice}>{`${props.gunPrice} Dc`}</div>
                <ItemBtn
                    isActive={!!props.activateBtnColor} // чётко булево
                    activateBtn={handleActivate}
                    price={t('add_good')}
                />
            </div>
        </div>
    )
}

// сравнение пропсов, чтобы исключить ненужные ререндеры
export default React.memo(ItemSm, (prev, next) => {
    return (
        prev.id === next.id &&
        prev.gunModel === next.gunModel &&
        prev.gunStyle === next.gunStyle &&
        prev.gunPrice === next.gunPrice &&
        prev.imgPath === next.imgPath &&
        prev.type === next.type &&
        prev.state === next.state &&
        prev.activateBtnColor === next.activateBtnColor
    )
})
