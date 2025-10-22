'use client'
import React from 'react'
import WibOnlineLive from '@/components/WibOnlineLive'
import WibStartTop from '@/components/WibStartTop'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setTopActiveState } from '@/redux/dropSliderReducer'

function WibManagerBlock(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isTopActive = useAppSelector(state => state.dropSlider.isTopActive)
    const userAmount = useAppSelector(state => state.dropSlider.userAmount)
    console.log(userAmount)
    const changeSlider = () => {
        dispatch(setTopActiveState(!isTopActive))
    }

    return (
        <>
            <WibOnlineLive changeState={changeSlider} onlineUserAmount={userAmount} isActive={isTopActive}></WibOnlineLive>
            <WibStartTop changeState={changeSlider} isActive={isTopActive}></WibStartTop>
        </>
    )
}

export default WibManagerBlock
