import { MutableRefObject } from 'react';
export function startRecordVoice(
  streamRef: MutableRefObject<MediaStream | null>,
  recorderRef: MutableRefObject<MediaRecorder | null>,
  audioDataRef: any,
  threshold?: number,
) {
  if (streamRef.current) {
    recorderRef.current = new MediaRecorder(streamRef.current);

    let audioContext: any;
    let source;
    let analyser: any;

    let bufferLength: number;
    let dataArray: Uint8Array;

    if (threshold) {
      audioContext = new AudioContext();
      source = audioContext.createMediaStreamSource(streamRef.current);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const voiceChunk: any[] = [];
    recorderRef.current.ondataavailable = async (e: BlobEvent) => {
      if (threshold) {
        analyser.getByteFrequencyData(dataArray);
        console.log('{ BlobEvent }', e);

        let sum = 0;
        for (let data of dataArray) {
          sum += data;
        }
        let volume = Math.floor((sum / dataArray.length / 256) * 100);
        console.log(volume, threshold);
        if (volume >= threshold) {
          console.log('{ ondataavailable: 청크 추가 }');
          voiceChunk.push(e.data);
        }
      } else {
        console.log('{ ondataavailable: 청크 추가 **no Threshold}');
        voiceChunk.push(e.data);
      }
      console.log(voiceChunk);
    };

    recorderRef.current.onstop = async () => {
      console.log('{ onStop}');
      console.log(voiceChunk);

      const audioBlob: Blob = new Blob(voiceChunk, { type: 'audio/mp3' });
      voiceChunk.splice(0, voiceChunk.length);

      audioDataRef.current = audioBlob;
    };

    recorderRef.current.start(500);
  }
}
