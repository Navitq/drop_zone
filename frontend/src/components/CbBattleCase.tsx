import React from 'react'
import style from '@/styles/battles.module.scss'

import Image from 'next/image'

function CbBattleCase(): React.ReactNode {
    return (
        <div className={style.CbBattleCase}>
            <div className={style.cbCaseImgCnt}>
                <Image className={style.cbCaseImg} fill src={"/images/case_mock.png"} alt={"awd"} ></Image>
            </div>
        </div>
    )
}

export default CbBattleCase
