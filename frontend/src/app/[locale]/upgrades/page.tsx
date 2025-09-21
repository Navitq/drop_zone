import TitleHomePage from '@/components/TitleHomePage';
import style from '@/styles/upgrades.module.scss';

import ExchangeBlock from '@/components/ExchangeBlock'
import ExchangePropierty from '@/components/ExchangePropierty'


export default function UpgradesPage(): React.ReactNode {

    return (
        <div className={style.upgrades}>
            <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/blue_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/violet_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/pink_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/red_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/yellow_upgrade_background.png)' }} />
            </div>
            <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/mobile_blue_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/mobile_violet_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/mobile_pink_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/mobile_red_upgrade_background.png)' }} />
                <div style={{ width: '100px', height: '100px', backgroundImage: 'url(/images/mobile_yellow_upgrade_background.png)' }} />
            </div>
            <div className={style.ugdTitleBlock}>
                <TitleHomePage textKey={"t_upgrades"}></TitleHomePage>
            </div>
            <ExchangeBlock></ExchangeBlock>
            <ExchangePropierty></ExchangePropierty>
        </div >
    );
}
