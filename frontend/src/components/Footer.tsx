import React from 'react'
import btcss from '@/styles/basement.module.scss'


function Footer(): React.ReactNode {
    return (
        <footer className={btcss.basement}>
            <div className={btcss.basementCompanyBlock}>
                <div className={btcss.companyName}>DROPZONE</div>
                <div className={btcss.copyright}>Copyright (c) 2025 DROPZONE.ORG</div>
            </div>
            <div></div>
            <div></div>
            <div></div>
        </footer>
    )
}

export default Footer
