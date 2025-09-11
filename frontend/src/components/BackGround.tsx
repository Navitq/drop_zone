'use client'
import React, { useMemo } from 'react'
import style from '@/styles/background.module.scss'
import { FRONTEND_PATHS } from '@/utilites/urls'
import { usePathname } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function BackGround(): React.ReactNode {
    const pathname = usePathname();
    const isAuthPage = useMemo(() => pathname === FRONTEND_PATHS.home, [pathname]);
    const t = useTranslations("background")
    return isAuthPage ? (
        <div className={style.backgroundBlock}>
            <div className={style.pictureCnt}>
                <div className={style.backgroundImgCnt}>
                    <Image
                        src="/images/background_main.png"
                        alt={t('season_background_alt')}
                        fill

                    />
                </div>
                <div className={style.backgroundMobileImgCnt}>
                    <Image
                        src="/images/background_main_mobile.png"
                        alt={t('season_background_alt')}
                        fill
                    />
                </div>
                <div className={style.pictureGrassCnt}>
                    <div className={style.backgroundImgCnt}>
                        <Image
                            src="/images/grass.png"
                            alt={t('season_background_alt')}
                            fill

                        />
                    </div>
                    <div className={style.backgroundMobileImgCnt}>
                        <Image
                            src="/images/grass_mobile.png"
                            alt={t('season_background_alt')}
                            fill
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
