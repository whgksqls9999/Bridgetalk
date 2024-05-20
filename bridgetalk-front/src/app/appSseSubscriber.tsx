import { handleSubscribeNotification, useUserStore } from '@/pages';
import { decodeToken } from '@/shared';
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

      sseEventSource.onopen = (e) => {};
      sseEventSource.onmessage = (e) => {};
      sseEventSource.onerror = (e) => {};

      userStore.setSseEventSource(sseEventSource);
    }

    return () => {
      if (sseEventSource) {
        sseEventSource.close();
      }
    };
  }, [userStore.accessToken]);

  return <></>;
}
