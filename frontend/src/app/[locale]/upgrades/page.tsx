import TitleHomePage from '@/components/TitleHomePage';
import style from '@/styles/upgrades.module.scss';

import ExchangeBlock from '@/components/ExchangeBlock'
import ItemSm from '@/components/ItemSm'

export default function UpgradesPage(): React.ReactNode {


    return (
        <div className={style.upgrades}>
            <div className={style.ugdTitleBlock}>
                <TitleHomePage textKey={"t_upgrades"}></TitleHomePage>
            </div>

            <ExchangeBlock></ExchangeBlock>
            <ItemSm gunModel={"MP4"} gunStyle={"Venom"} gunPrice={9.84} imgPath={'/images/example_gun_blue.png'} type={"epic"}></ItemSm>
        </div >
    );
}
