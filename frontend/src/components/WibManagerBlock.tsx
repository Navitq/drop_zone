'use client'
import React, { useState } from 'react'
import WibOnlineLive from '@/components/WibOnlineLive'
import WibStartTop from '@/components/WibStartTop'

function WibManagerBlock(): React.ReactNode {
    const [isActive, setIsActive] = useState<boolean>(false)

    const changeSlider = () => {
        setIsActive(state => !state)
    }

    return (
        <>
            <WibOnlineLive changeState={changeSlider} onlineUserAmount={0} isActive={isActive}></WibOnlineLive>
            <WibStartTop changeState={changeSlider} isActive={isActive}></WibStartTop>
        </>
    )
}

export default WibManagerBlock
