import React, { use } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

interface StatElemProps {
    message: number | null,
    imgPath: string,
    titleKey: string,
    imgAltKey: string
}

export default function StatElem(props: StatElemProps): React.ReactNode {
    const t = useTranslations('homePage');
    return (
        <div>
            <div>
                <Image src={`@/images/${props.imgPath}`} alt={t(`${props.imgAltKey}`)} />
            </div>
            <div>
                <div>{t(`${props.titleKey}`)}</div>
                <div>{props.message}</div>
            </div>
        </div>
    )
}
