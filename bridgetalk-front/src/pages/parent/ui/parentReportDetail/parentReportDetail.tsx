import * as S from '@/styles/parent/parentReportDetail.style';
import { useNavigate, useParams } from 'react-router-dom';
import { ParentReportDetailRecorder } from './parentReportDetailRecorder/parentReportDetailRecorder';
import { BackButton } from '@/shared';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { getReportDetail } from '../../query';
import { useReportStore } from '../../store';

export function ParentReportDetail() {
  // Navigate
  const navigate = useNavigate();

  // Params
  const params = useParams();

  // Global State
  const language = useReportStore((state) => state.language);
  const reports_UUID = useReportStore((state) => state.reports_UUID);
  const setResultPage = useReportStore((state) => state.setResultPage);
  const resultPage = useReportStore((state) => state.resultPage);

  // State
  const [report, setReport] = useState<any>('');
  const [date, setDate] = useState<string[]>([]);

  const dateWord: any = useMemo(
    () => ({
      kor: ['.', '.', '.'],
      viet: ['.', '.', '.'],
    }),
    [],
  );
  const title: any = useMemo(
    () => ({
      kor: '분석 리포트',
      viet: 'Báo cáo',
    }),
    [],
  );

  const menu: any = useMemo(
    () => ({
      kor: ['요약', '솔루션'],
      viet: ['Tóm tắt', 'Giải pháp'],
    }),
    [],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data: any = await getReportDetail(
          reports_UUID.get(Number(params.reportsId)),
          Number(params.reportsId),
          language,
        );

        setReport(data.data);
        setDate(data.data.createdAt.split('T')[0].split('-'));
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [language]);

  return (
    <>
      <BackButton path="../report" navigate={navigate} />
      <S.ContentContainer>
        <div className="menu">
          {Array(2)
            .fill(0)
            .map((it, idx) => (
              <button
                className={`menu__summary ${idx === resultPage ? 'active' : ''}`}
                onClick={() => {
                  setResultPage(idx);
                }}
              >
                {menu[language][idx]}
              </button>
            ))}
        </div>
        <div className="leftside">
          {report && (
            <>
              <div className="title" style={{ fontFamily: language === 'kor' ? 'DNF' : 'Pretendard-Black' }}>
                {date[0]}
                {dateWord[language][0]} {date[1]}
                {dateWord[language][1]} {date[2]} {title[language]}
              </div>
              <div className="content-container">
                <Content
                  reportsKeywords={report.reportsKeywords}
                  reportsSolution={report.reportsSolution}
                  reportsSummary={report.reportsSummary}
                />
              </div>
            </>
          )}
        </div>
        <ParentReportDetailRecorder />
      </S.ContentContainer>
    </>
  );
}

interface Props {
  reportsKeywords: any[];
  reportsSummary: string;
  reportsSolution: string;
}

function Content({ reportsKeywords, reportsSummary, reportsSolution }: Props) {
  const resultPage = useReportStore((state) => state.resultPage);
  const language = useReportStore((state) => state.language);

  return (
    <>
      {resultPage === 0 ? (
        <div className="content">
          <S.Keywords>
            {reportsKeywords.map((keyword: any) => (
              <div className="keyword"># {keyword.trim()}</div>
            ))}
          </S.Keywords>
          <S.Summary>{reportsSummary}</S.Summary>
        </div>
      ) : (
        <div className="solution">{reportsSolution}</div>
      )}
    </>
  );
}
