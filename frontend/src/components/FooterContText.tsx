import React from 'react'
import { useTranslations } from 'next-intl';


interface TextFooterCont {
    textKey: string,
    styleClass: string
}

function FooterContText(props: TextFooterCont): React.ReactNode {
    const t = useTranslations('homePage');
    return (
        <div className={`${props.styleClass}`}>
            {t(props.textKey)}
        </div>
    )
}

export default FooterContText
