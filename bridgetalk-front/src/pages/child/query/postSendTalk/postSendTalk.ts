import { customAxios } from '@/shared';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function postSendTalk(reportsId: number, audio: Blob, setReply: any) {
  const formData = new FormData();

  // Blob => FileData
  const fileData = await audio.arrayBuffer();
  const newFileData = new Uint8Array(fileData);

  const ffmpeg = new FFmpeg();

  const baseURL = '/@ffmpeg/core/dist/esm';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  // webm => mp3 변환
  await ffmpeg.writeFile('input.webm', newFileData);
  console.log('{posetSendTalk: writeFile}');
  const exec = await ffmpeg.exec(['-i', 'input.webm', '-vn', '-ab', '192k', 'output.mp3']);
  console.log('{posetSendTalk: exec}', exec);
  const data: any = await ffmpeg.readFile('output.mp3');
  console.log('{posetSendTalk: readFile}');
  const newBlob = new Blob([data.buffer], { type: 'audio/mpeg' });
  console.log('{posetSendTalk: create new Blob}', newBlob);

  formData.append('reportsFile', newBlob);

  return customAxios
    .patch(`/reports/talk-send`, formData, {
      responseType: 'blob',
    })
    .then((res) => {
      const replyURL = URL.createObjectURL(res.data);
      setReply(replyURL);
    })
    .catch((err) => console.log(err));
}
