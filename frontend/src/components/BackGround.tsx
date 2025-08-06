'use client'
import React, { useMemo } from 'react'
import style from '@/styles/background.module.scss'
import { FRONTEND_PATHS } from '@/utilites/urls'
import { usePathname } from '@/i18n/navigation'

export default function BackGround(): React.ReactNode {
    const pathname = usePathname();
    const isAuthPage = useMemo(() => pathname === FRONTEND_PATHS.home, [pathname]);

    return isAuthPage ? (
        <div className={style.backgroundBlock}>
            <div className={style.pictureCnt}></div>
        </div>
    ) : null;
}
