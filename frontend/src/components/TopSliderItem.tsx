import React from 'react'
import style from '@/styles/itemStyle.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link';
import { FRONTEND_PATHS } from '@/utilites/urls';

type items_state = 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred'

const stateShort = {
    factory_new: "FN",
    minimal_wear: "MW",
    field_tested: "FT",
    well_worn: "WW",
    battle_scarred: "BS"
}


interface ItemSmInt {
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    state: items_state,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
    userId: string;
    userImg: string;
    username: string;
    caseImg: string | null;
}

function TopSliderItem(props: ItemSmInt): React.ReactNode {
    const t = useTranslations("wibBlock")

    return (
        <div className={`${style.ScmCaseItem} ${style[props.type + "ScmCaseItem"]} ${style.ScmCaseItemTopSlider}`}>
            <div className={style.scmGoodState}>{stateShort[props.state]}</div>
            <div className={style.scmCaseImgCnt}>
                <Image fill alt={`${props.gunModel}, ${props.gunStyle}`} src={props.imgPath} className={style.smItemImg}></Image>
            </div>
            <div className={style.scmCaseInfoBlck}>
                <div className={style.scmCaseInfoCnt}>
                    <div className={style.scmCaseGunModel}>{`${props.gunModel} |`}</div>
                    <div className={style.scmCaseGunStyle}>{`${props.gunStyle}`}</div>
                </div>
                <div className={`${style.scmCaseGunPrice}`}></div>
            </div>
            <div className={style.stiUserGameData}>
                <div className={style.stiUserData}>
                    <div className={style.stiUserImgBlock}>
                        <div className={style.stiUserImgCnt}>
                            <Image alt={t('user_icon')} src={props.userImg} fill></Image>
                        </div>
                    </div>
                    <div className={style.stiUserNameCnt}>
                        <Link href={FRONTEND_PATHS.profileUserPath(props.userId)}>
                            <div className={style.stiUserName}>
                                {props.username}
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={style.stiCaseData}>
                    <div className={style.stiCaseImgCnt}>
                        <Image alt={t('user_icon')} src={props.caseImg || ""} fill></Image>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopSliderItem
