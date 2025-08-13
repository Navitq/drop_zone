import TitleHomePage from '@/components/TitleHomePage';
import style from '@/styles/upgrades.module.scss';

import ExchangeBlock from '@/components/ExchangeBlock'

export default function UpgradesPage(): React.ReactNode {
    return (
        <div className={style.upgrades}>
            <div className={style.ugdTitleBlock}>
                <TitleHomePage textKey={"t_upgrades"}></TitleHomePage>
            </div>

            <ExchangeBlock></ExchangeBlock>

        </div >
    );
}
