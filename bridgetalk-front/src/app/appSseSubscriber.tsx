import { handleSubscribeNotification, useUserStore } from '@/pages';
import { decodeToken } from '@/shared';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect } from 'react';

export function AppSseSubscriber() {
  const userStore = useUserStore();

  useEffect(() => {
    // get Event Source
    let sseEventSource = userStore.sseEventSource;
    const accessToken = decodeToken('access');

    if (!accessToken) return;

    if (!sseEventSource) {
      sseEventSource = handleSubscribeNotification();

      if (!sseEventSource) return;
      sseEventSource.onmessage = (e) => {
        console.log('메세지 도착');
        console.log(e);
        alert(e);
      };

      sseEventSource.onerror = (e) => {
        console.log(e);
      };

      userStore.setSseEventSource(sseEventSource);
      console.log(sseEventSource);
    }

    return () => {
      if (sseEventSource) {
        sseEventSource.close();
      }
    };
  }, [userStore.accessToken]);

  return <></>;
}
