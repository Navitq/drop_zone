import style from '@/styles/homePage.module.scss';

import SeasonCasesBlock from '@/components/SeasonCasesBlock';
import ActualCases from '@/components/ActualCases'
import BlogerCases from '@/components/BlogerCases'
import AdvertisementBlock from '@/components/AdvertisementBlock'
import StCaseModal from '@/components/StCaseModal'

export default function HomePage() {
  return (
    <div className={style.homePage}>
      <SeasonCasesBlock></SeasonCasesBlock>
      <div className={style.mainContentSize}>
        <AdvertisementBlock></AdvertisementBlock>
        <ActualCases></ActualCases>
        <BlogerCases></BlogerCases>
      </div>
      <StCaseModal></StCaseModal>
    </div >
  );
}
