import { NavigateFunction } from 'react-router-dom';
import { postSignin } from '../../query';
import { setToken } from '@/shared';

export function handleSignin(requestDto: any, userStore: any, navigate: NavigateFunction) {
  postSignin(requestDto)
    .then((res: any) => {
      if (res.status === 200) {
        const data = res.data;

        // base64 인코딩
        setToken(data.accessToken, data.refreshToken);

        sessionStorage.setItem('dino', data.userDino);

        userStore.setUserId(data.userId);
        userStore.setUserDino(data.userDino);
        userStore.setUserEmail(data.userEmail);
        userStore.setUserName(data.name);
        userStore.setUserNickname(data.userNickname);
        userStore.setAccessToken(data.accessToken);
        userStore.setRefreshToken(data.refreshToken);

        navigate('/profile');
      }
    })
    .catch((err) => alert('로그인 정보가 일치하지 않습니다.'));
}
