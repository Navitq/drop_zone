import React from 'react'

import style from '@/styles/profile.module.scss'

import PrOwnerStaffHeader from '@/components/PrOwnerStaffHeader'
import PrUserStaffHeader from '@/components/PrUserStaffHeader'
import ExClientStuffs from '@/components/ExClientStuffs'


function PrStuffsCnt(): React.ReactNode {
    const isAuth = false;
    return (
        <div className={style.prStuffsCnt}>
            {isAuth ? <PrOwnerStaffHeader amount={48} price={1548.47}></PrOwnerStaffHeader> : <PrUserStaffHeader amount={48} price={1548.47}></PrUserStaffHeader>}
            <ExClientStuffs></ExClientStuffs>
        </div>
    )
}

export default PrStuffsCnt
