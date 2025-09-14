'use client'
import React, { useMemo, useState, useEffect } from 'react'
import style from '@/styles/background.module.scss'
import { FRONTEND_PATHS } from '@/utilites/urls'
import { usePathname } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BACKEND_PATHS } from '@/utilites/urls'
import api from '@/lib/api'

interface backgroundInt {
    pc_background_url: string
    mobile_background_url: string
    pc_background_grass_url: string
    mobile_background_grass_url: string
}

export default function BackGround(): React.ReactNode {
    const [background, setBackground] = useState<backgroundInt>()
    const pathname = usePathname();
    const isAuthPage = useMemo(() => pathname === FRONTEND_PATHS.home, [pathname]);
    const t = useTranslations("background")

    useEffect(() => {
        getAndSetBackground();
    }, [])

    async function getAndSetBackground() {
        try {
            const response = await api.get(BACKEND_PATHS.homePageBackground);
            console.log(response.data)
            setBackground(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    return isAuthPage && background?.mobile_background_grass_url ? (
        <div className={style.backgroundBlock}>
            <div className={style.pictureCnt}>
                <div className={style.backgroundImgCnt}>
                    <Image
                        src={background.pc_background_url}
                        alt={t('season_background_alt')}
                        fill

                    />
                </div>
                <div className={style.backgroundMobileImgCnt}>
                    <Image
                        src={background.mobile_background_url}
                        alt={t('season_background_alt')}
                        fill
                    />
                </div>
                <div className={style.pictureGrassCnt}>
                    <div className={style.backgroundImgCnt}>
                        <Image
                            src={background.pc_background_grass_url}
                            alt={t('season_background_alt')}
                            fill

                        />
                    </div>
                    <div className={background.mobile_background_grass_url}>
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
