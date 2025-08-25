import React from 'react'
import style from '@/styles/profile.module.scss'

function PrBestObject({ children }: React.PropsWithChildren): React.ReactNode {
    return (
        <div className={style.prBestObject}>
            {children}
        </div>
    )
}

export default PrBestObject
