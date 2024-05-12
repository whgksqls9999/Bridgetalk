import { postVoiceBlob, useReportStore, useVoiceStore } from '@/pages';
import { customAxios } from '@/shared/util';
import * as S from '@/styles/shared/modalSpace.style';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export function ModalSpace() {
  const isRecordFinished = useVoiceStore((state) => state.isRecordFinished);

  return <>{isRecordFinished && <ParentVoiceRecordModalArea />}</>;
}

function ParentVoiceRecordModalArea() {
  const { pathname } = useLocation();
  const pathnameRoot = pathname.split('/');
  const reportId: number = Number(pathnameRoot[pathnameRoot.length - 1]);

  // Global State
  const setIsRecordFinished = useVoiceStore((state) => state.setIsRecordFinished);
  const audioBlob = useVoiceStore((state) => state.audioBlob);
  const language = useReportStore((state) => state.language);

  const title = useMemo(
    () => ({
      kor: '녹음이 완료됐어요!',
      viet: 'Việc ghi âm đã xong!',
    }),
    [],
  );

  const button = useMemo(
    () => ({
      kor: ['취소하기', '보내기'],
      viet: ['Bỏ', 'Gửi'],
    }),
    [],
  );

  function handleClose(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation();
    if (e.target instanceof HTMLElement && [...e.target!.classList].some((it) => it === 'closable')) {
      if (confirm('녹음 기록은 저장되지 않습니다.\n정말 나가시겠습니까?')) {
        setIsRecordFinished(false);
      }
    }
  }

  console.log(audioBlob);
  if (audioBlob) {
    console.log(URL.createObjectURL(audioBlob));
  }

  return (
    <S.Container className="closable" onClick={handleClose}>
      <S.AudioContainer>
        <div className="title" style={{ fontFamily: language === 'kor' ? 'DNF' : 'CherryBomb' }}>
          {title[language]}
        </div>
        <audio className="audio" src={URL.createObjectURL(audioBlob!)} controls></audio>
        <div className="buttons" style={{ display: 'flex', gap: '2svw' }}>
          <button
            className="closable close"
            onClick={handleClose}
            style={{ fontFamily: language === 'kor' ? 'DNF' : 'CherryBomb' }}
          >
            {button[language][0]}
          </button>
          <button
            className="send"
            style={{ fontFamily: language === 'kor' ? 'DNF' : 'CherryBomb' }}
            onClick={() => {
              if (confirm('해당 편지를 전달할까요?')) {
                alert('전달 애니메이션 보여주기');
                setIsRecordFinished(false);
                postVoiceBlob(reportId, audioBlob!);
              }
            }}
          >
            {button[language][1]}
          </button>
        </div>
      </S.AudioContainer>
    </S.Container>
  );
}
