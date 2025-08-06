import React from 'react'
import CaseName from '@/components/CaseName'
import CaseBtn from '@/components/CaseBtn'
import style from '@/styles/cases.module.scss'

function CaseInfoBlock(): React.ReactNode {
    return (
        <div className={style.caseInfoBlock}>
            <CaseName></CaseName>
            <CaseBtn></CaseBtn>
        </div>
    )
}

export default CaseInfoBlock
