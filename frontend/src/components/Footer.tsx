import React from 'react'
import btcss from '@/styles/basement.module.scss'
import FooterPageLinks from '@/components/FooterPageLinks'


function Footer(): React.ReactNode {
    return (
        <footer className={btcss.basement}>
            <div className={btcss.mainInfo}>
                <div className={btcss.basementCompanyBlock}>
                    <div className={btcss.companyName}>DROPZONE</div>
                    <div className={btcss.copyright}>Copyright (c) 2025 DROPZONE.ORG</div>
                </div>
                <div className={btcss.pagesBlock}>
                    <div>
                        <FooterPageLinks textKey='main_page' path='home' sizeClass={'sixteen_sz'}></FooterPageLinks>
                        <FooterPageLinks textKey='contracts' path='contracts' sizeClass={'sixteen_sz'}></FooterPageLinks>
                        <FooterPageLinks textKey='upgrades' path='upgrades' sizeClass={'sixteen_sz'}></FooterPageLinks>
                    </div>
                    <div>
                        <FooterPageLinks textKey='battles' path='battles' sizeClass={'sixteen_sz'}></FooterPageLinks>
                        <FooterPageLinks textKey='raffles' path='raffles' sizeClass={'sixteen_sz'}></FooterPageLinks>
                        <FooterPageLinks textKey='faq' path='faq' sizeClass={'sixteen_sz'}></FooterPageLinks>
                    </div>
                </div>
            </div>
            <div></div>
            <div></div>
        </footer >
    )
}

export default Footer
