import React from 'react'
import CaseShelf from '@/components/CaseShelf'
import TitleHomePage from '@/components/TitleHomePage'
import style from '@/styles/homePage.module.scss'
import { BACKEND_PATHS } from '@/utilites/urls'

function BlogerCases(): React.ReactNode {
    return (
        <div className={style.actBlock}>
            <div className={style.actTitleCnt}>
                <TitleHomePage textKey="bloger_case_title"></TitleHomePage>
            </div>
            <CaseShelf caseUrl={'bloger_case'}></CaseShelf>
        </div>
    )
}

export default BlogerCases
