import axios from 'axios';
import { getTalkStart } from '../../query';
import { errorCatch } from '@/shared';
import { decodeFormData } from '../decodeFormData/decodeFormData';

export async function handleTalkStart(setReply: any, setEmotion: any, setSubtitle: any, setErrorModalState: any) {
  try {
    const data = await getTalkStart();
    const parsedData = await decodeFormData(data);

    setEmotion(parsedData.emotionValue);
    setSubtitle(parsedData.subtitleValue);
    setReply(parsedData.audioValue);
  } catch (err) {
    if (err instanceof Error) {
      errorCatch(err, setErrorModalState);
    }
  }
}