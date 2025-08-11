import style from '@/styles/homePage.module.scss';

import SeasonCasesBlock from '@/components/SeasonCasesBlock';
import ActualCases from '@/components/ActualCases'
import BlogerCases from '@/components/BlogerCases'
import AdvertisementBlock from '@/components/AdvertisementBlock'

export default function HomePage() {
  return (
    <div className={style.homePage}>
      <SeasonCasesBlock></SeasonCasesBlock>
      <div className={style.mainContentSize}>
        <AdvertisementBlock></AdvertisementBlock>
        <ActualCases></ActualCases>
        <BlogerCases></BlogerCases>
      </div>
    </div >
  );
}
