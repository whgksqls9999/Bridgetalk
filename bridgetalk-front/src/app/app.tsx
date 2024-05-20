import * as S from '@/styles/app/app.style';
import { AppRoutes } from './appRoutes';
import { ModalSpace } from '@/shared';
import { AppSseSubscriber } from './appSseSubscriber';
import { AppPreloader } from './appPreloader';
import { registServiceWorker } from '@/shared/model/registServiceWorker/registServiceWorker';

export function App() {
  registServiceWorker();

  return (
    <S.Container>
      <AppSseSubscriber />
      <AppPreloader />
      <S.GlobalStyle />
      <AppRoutes />
      <ModalSpace />
    </S.Container>
  );
}
