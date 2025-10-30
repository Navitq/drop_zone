import React, { useCallback } from 'react'
import style from '@/styles/itemStyle.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ItemBtn from '@/components/ItemBtn'
import ContractsModalBtn from '@/components/ContractsModalBtn'

interface ItemSmInt {
    activateBtnColor?: boolean
    id: string
    gunModel: string
    gunStyle: string
    gunPrice: number
    imgPath: string
    type: 'usuall' | 'rare' | 'elite' | 'epic' | 'classified'
    state: string
    activateBtn: () => void,
    deleteBtn?: () => void,
    deleteTxt?: string,
    activeBtlText?: string,
    isActiveProfile?: boolean,
}

function ItemSm(props: ItemSmInt): React.ReactNode {
    const t = useTranslations('items')
    const { activateBtn, deleteBtn } = props;
    // мемоизируем колбэк, чтобы не создавать новую функцию
    const handleActivate = useCallback(() => {
        activateBtn()
    }, [activateBtn])

    const handleRemove = useCallback(
        () => {
            if (deleteBtn) {
                deleteBtn();
            }
            // Если props.removeItem нет — функция просто ничего не делает
        },
        [deleteBtn]
    );

    return (
        <div className={`${style.smItemCnt} ${style[props.type + 'ItemSmType']} ${props.activateBtnColor && props.deleteTxt ? style.smItemCntWithDelete : ""}`}>
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
                {props.isActiveProfile == undefined || props.isActiveProfile == null ? (
                    <ItemBtn
                        isActive={props.activateBtnColor} // четко булево значение
                        activateBtn={handleActivate}      // функция нажатия
                        price={props.activeBtlText ? props.activeBtlText : t('add_good')} // текст на кнопке
                    />
                ) : (
                    props.isActiveProfile == false
                ) ? null : (
                    <ItemBtn
                        isActive={props.activateBtnColor} // четко булево значение
                        activateBtn={handleActivate}      // функция нажатия
                        price={props.activeBtlText ? props.activeBtlText : t('add_good')} // текст на кнопке
                    />
                )}
                {props.deleteTxt && props.activateBtnColor ? (
                    <div className={style.smRemoveBtn}>
                        <ContractsModalBtn
                            text={props.deleteTxt}
                            click={handleRemove}
                        />
                    </div>) : (
                    ""
                )}
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
