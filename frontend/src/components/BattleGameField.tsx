import React from 'react'

import style from '@/styles/battles.module.scss'
import BattlePersonalBox from "@/components/BattlePersonalBox"

function BattleGameField(): React.ReactNode {
    return (
        <div className={`${style.bgfCnt} ${style.fourPlayerCnt}`}>
            <BattlePersonalBox userName={"Naruto Uzumaki"} imgPath={"/images/example_avatar.png"}></BattlePersonalBox>
            <BattlePersonalBox userName={"Naruto Uzumaki"} imgPath={"/images/example_avatar.png"}></BattlePersonalBox>
            <BattlePersonalBox userName={"Naruto Uzumaki"} imgPath={"/images/example_avatar.png"}></BattlePersonalBox>

            <BattlePersonalBox userName={"Naruto Uzumaki"} imgPath={"/images/example_avatar.png"}></BattlePersonalBox>

        </div>
    )
}

export default BattleGameField
