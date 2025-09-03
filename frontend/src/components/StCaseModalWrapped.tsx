'use client'

import React, { useEffect } from 'react'
import style from '@/styles/modal.module.scss'
import { useAppSelector } from '@/lib/hooks'
import { useTranslations } from 'next-intl'
import ScmCaseItem from '@/components/ScmCaseItem'

function StCaseModalWrapped({ close }: () => void): React.ReactNode {
    const { caseId, caseName, caseItems } = useAppSelector(state => state.modal.stCaseModal)
    const t = useTranslations("homePage")

    function getCaseData() {
        return;
    }

    useEffect(() => {
        if (caseId) {
            getCaseData()
        }
    }, [caseId])

    return (
        <div onClick={(e) => { e.stopPropagation() }} className={style.scmCnt}>
            <div className={style.scmCaseName}>{`${t('case_modal')} ${caseName}`}</div>
            <div className={style.scmCaseItemsStore}>
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="usuall" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="rare" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="classified" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="elite" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="epic" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="usuall" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="rare" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="classified" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="elite" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="epic" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="usuall" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="rare" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="classified" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="elite" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="epic" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="usuall" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="rare" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="classified" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="elite" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
                <ScmCaseItem imgPath="/images/example_gun_blue.png" gunModel="AK-47" type="epic" gunStyle="LIZARD PIZARD" gunPrice={58.48} />
            </div>
        </div>
    )
}

export default StCaseModalWrapped
