import React from 'react'

import style from '@/styles/profile.module.scss'

import PrOwnerStaffHeader from '@/components/PrOwnerStaffHeader'
import PrUserStaffHeader from '@/components/PrUserStaffHeader'
import ExClientStuffs from '@/components/ExClientStuffs'
import { useTranslations } from 'next-intl'
import { BACKEND_PATHS } from '@/utilites/urls'

interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function PrStuffsCnt(props: { client_id: string, ownerId: string }): React.ReactNode {
    const t = useTranslations("upgrades")

    function activateBtn(item: gunItemModel) {
        console.log(item)
    }

    function getItemFromServer(item: gunItemModel) {
        console.log(item)
    }

    return (
        <div className={`${style.prStuffsCnt} prStuffsCnt`}>
            {props.client_id === props.ownerId && props.ownerId != undefined ? <PrOwnerStaffHeader amount={48} price={1548.47}></PrOwnerStaffHeader> : <PrUserStaffHeader amount={48} price={1548.47}></PrUserStaffHeader>}
            <ExClientStuffs activeBtlText={t('sell_good')} isActiveProfile={true} titleText={t("open_return")} removeItem={(item) => { getItemFromServer(item) }} btnText={t("go_to_case")} deleteTxt={t('get_item')} activateBtn={(value) => { activateBtn(value) }} targetUrl={BACKEND_PATHS.getInventoryStaff} body={{ client_id: props.client_id, limit: 25 }}></ExClientStuffs>
        </div>
    )
}

export default PrStuffsCnt
