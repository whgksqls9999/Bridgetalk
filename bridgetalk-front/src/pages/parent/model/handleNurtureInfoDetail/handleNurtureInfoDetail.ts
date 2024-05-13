import { getNurtureInfoDetail } from '../../query';

export async function handleNurtureInfoDetail(infoId: number, language: any, setInfoDetail: any) {
  try {
    const fetchData = await getNurtureInfoDetail(infoId, language);

    setInfoDetail(fetchData.data);
  } catch (err) {
    console.log(err);
  }
}