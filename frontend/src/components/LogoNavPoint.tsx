'use client'

import React, { useMemo } from 'react'
import LogoCnt from '@/components/LogoCnt'
import style from '@/styles/header.module.scss'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from '@/i18n/navigation';


interface PointRules {
    width: number;
    height: number;
    cntClass?: string;
    path: string;
    altKey: string;
    imgClass?: string;
    textKey: string;
    linkPath: string;
    pathSm?: string;
}

function LogoNavPoint(props: PointRules): React.ReactNode {
    const t = useTranslations('header');
    const pathname = usePathname()

    const isActive = useMemo(() => pathname === props.linkPath, [pathname, props.linkPath])

    return (
        <div className={style.navPointBlockCnt}>
            <Link href={props.linkPath} className={style.navPointBlock}>
                <div className={style.linkPathWrapper}>
                    <LogoCnt width={props.width} height={props.height} cntClass={props.cntClass ? props.cntClass : undefined} path={props.path} altKey={props.altKey} imgClass={props.imgClass ? props.imgClass : undefined}></LogoCnt>
                </div>
                <div className={style.linkPathWrapperSm}>
                    {isActive && props.pathSm ? <LogoCnt width={40} height={40} cntClass={props.cntClass ? props.cntClass : undefined} path={props.pathSm} altKey={props.altKey} imgClass={props.imgClass ? props.imgClass + 'Activate' : undefined}></LogoCnt> : <LogoCnt width={props.width} height={props.height} cntClass={props.cntClass ? props.cntClass : undefined} path={props.path} altKey={props.altKey} imgClass={props.imgClass ? props.imgClass : undefined}></LogoCnt>}
                </div>
                <div className={style.navPointTextCnt}>
                    <div className={style.navPointText}>{t(props.textKey)}</div>
                    {isActive ? <LogoCnt width={7} height={7} cntClass={'pagePointImg'} path={"/images/active_header_point.svg"} altKey={"active_header_point"}></LogoCnt> : null}
                </div>
            </Link>
        </div>
    )
}

export default React.memo(LogoNavPoint)
