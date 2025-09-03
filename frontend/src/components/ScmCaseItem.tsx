import React from 'react'
import style from '@/styles/modal.module.scss'

interface ItemSmInt {
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified"
}

function ScmCaseItem(props: ItemSmInt): React.ReactNode {
    return (
        <div className={style.scmCaseItem}>
            daw
        </div>
    )
}

export default ScmCaseItem
