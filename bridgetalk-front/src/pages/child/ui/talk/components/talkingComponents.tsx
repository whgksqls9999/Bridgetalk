import { getAvgVolume } from '@/pages/child/model';
import { getTalkStart, getTalkStop, postMakeReport, postSendTalk } from '@/pages/child/query';
import { useTalkStore } from '@/pages/child/store';
import { useVoiceStore } from '@/pages/parent';
import {
  Timer,
  connectAudioStream,
  generateAudioContext,
  generateVolumeCheckInterval,
  startRecordVoice,
  stopRecordVoice,
} from '@/shared';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export function TalkingComponents({ reply, setReply, devounceTimerRef }: any) {
  // Global State
  const volume = useVoiceStore((state) => state.volume);
  const setVolume = useVoiceStore((state) => state.setVolume);
  const setAudioBlob = useVoiceStore((state) => state.setAudioBlob);
  const audioBlob = useVoiceStore((state) => state.audioBlob);
  const { reportsId, setReportsId, isRecording, setIsRecording, isSend, setIsSend } = useTalkStore((state) => ({
    reportsId: state.reportsId,
    setReportsId: state.setReportsId,
    isRecording: state.isRecording,
    setIsRecording: state.setIsRecording,
    isSend: state.isSend,
    setIsSend: state.setIsSend,
  }));

  // State
  const [wait, setWait] = useState<boolean>(false);
  const [end, setEnd] = useState<boolean>(false);

  // Ref
  const audioDataRef = useRef<Blob | null>(null);
  const getAvgVolumeData = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 녹음 관련
  const streamRef: MutableRefObject<MediaStream | null> = useRef(null);
  const recorderRef: MutableRefObject<MediaRecorder | null> = useRef(null);

  // 볼륨 체크
  useEffect(() => {
    if (isRecording && getAvgVolumeData.current) {
      // console.log('볼륨:', volume, '평균 볼륨:', getAvgVolumeData.current(volume));
      if (volume >= Math.floor(getAvgVolumeData.current(volume) * 0.8)) {
        // console.log('{{볼륨이 평균 볼륨의 80% 이상이므로 2초 타이머 리셋}}');

        if (devounceTimerRef.current) {
          clearTimeout(devounceTimerRef.current);
        }
        devounceTimerRef.current = setTimeout(() => {
          console.log('타이머 작동');
          setIsSend(true);
          setIsRecording(false);
        }, 2000);
      }
    }
  }, [volume]);

  // 오디오 스트림 연결 및 해제
  useEffect(() => {
    if (!streamRef.current) {
      connectAudioStream(streamRef).then((res) => {
        if (res instanceof MediaStream) {
          // 리포트 만들고 대화(녹음) 시작하기
          // postMakeReport(setReportsId).then(() => {
          getTalkStart(setReply);
          // });

          setIsRecording(true);
        }
      });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current = null;
      }
    };
  }, []);

  // 녹음
  useEffect(() => {
    let volumeCheckInterval: any = null;

    if (isRecording && !volumeCheckInterval) {
      // 음량 체크
      const { analyser, bufferLength, dataArray }: any = generateAudioContext(streamRef)!;
      volumeCheckInterval = generateVolumeCheckInterval(analyser, dataArray, bufferLength, setVolume);

      // 녹음 시작
      startRecordVoice(streamRef, recorderRef, audioDataRef, 10);
    }

    if (!isRecording) {
      console.log('함수 재선언');
      getAvgVolumeData.current = getAvgVolume();
    }

    return () => {
      // 음량 체크 및 녹음 종료
      if (isRecording && volumeCheckInterval) {
        clearInterval(volumeCheckInterval);
        stopRecordVoice(recorderRef);
        setVolume(0);
      }
    };
  }, [isRecording]);

  // 한마디 전송 시
  useEffect(() => {
    if (isSend) {
      setTimeout(() => {
        setAudioBlob(audioDataRef.current!);
      }, 0);
    }
  }, [isSend]);

  // audioBlob(내 녹음 내용) 저장 후 '한 마디 전송' API 요청
  useEffect(() => {
    if (audioBlob && isSend) {
      console.log('{한마디 전송 API 요청', audioBlob);
      setWait(true);
      postSendTalk(reportsId, audioBlob, setReply).finally(() => {
        setIsSend(false);
        setWait(false);

        setTimeout(() => {
          setIsRecording(true);
        }, 1000);
      });
    }
  }, [audioBlob]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current!.play();
    }
  }, [reply]);

  return (
    <>
      <div className="record" style={{ position: 'fixed', bottom: '5', left: '5', opacity: 0.2 }}>
        <button
          onClick={() => {
            setIsSend(true);
            setIsRecording(false);
          }}
        >
          한 마디 전송하기
        </button>
      </div>
      {/* <button
        onClick={() => {
          getTalkStop(reportsId, setReply);
          setIsRecording(false);
          if (devounceTimerRef.current !== null) {
            clearInterval(devounceTimerRef.current);
          }
        }}
      >
        대화 종료
      </button> */}
      {wait && (
        <div style={{ fontFamily: 'DNF', fontSize: `3svw`, position: 'fixed', top: `10svh` }}>
          다이노가 어떤 말을 해줄지 생각중이에요
        </div>
      )}
      <Timer
        devounceTimerRef={devounceTimerRef}
        getTalkStop={getTalkStop}
        reportsId={reportsId}
        setIsRecording={setIsRecording}
        setReply={setReply}
      />

      <audio ref={audioRef} src={reply} hidden autoPlay />
    </>
  );
}
