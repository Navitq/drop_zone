import React from 'react'
import CaseName from '@/components/CaseName'
import CaseBtn from '@/components/CaseBtn'
import style from '@/styles/cases.module.scss'

function CaseInfoBlock(props: { caseNameKey: string, price: number, buyCaseModal: () => void }): React.ReactNode {
    return (
        <div className={style.caseInfoBlock}>
            <CaseName caseName={props.caseNameKey}></CaseName>
            <CaseBtn buyCaseModal={() => { props.buyCaseModal() }} price={props.price}></CaseBtn>
        </div>
    )
}

export default CaseInfoBlock
