import * as S from '@/styles/main/profilePage.style';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileList, deleteDeleteProfile, postProfileLogin } from '../../query';
import { customAxios, decodeToken, setToken } from '@/shared';
import { useProfileStore, useUserStore } from '../../store';
import { handleFetchProfileList } from '../../model';

interface Profile {
  userId: string;
  userName: string;
  userEmail: string;
  userNickname: string;
  userDino: string;
}

export function ProfilePage() {
  const navigate = useNavigate();

  const [profileList, setProfileList] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const userStore = useUserStore();

  const setDeleteModalOpenState = useProfileStore((state) => state.setDeleteModalOpenState);
  const setEditProfileModalState = useProfileStore((staet) => staet.setEditProfileModalState);
  const setPasswordCheckModalState = useProfileStore((state) => state.setPasswordCheckModalState);

  useEffect(() => {
    handleFetchProfileList(userStore.accessToken, setProfileList);
    setIsLoading(false);
  }, []);

  return (
    <S.Container>
      <button
        className="logout"
        onClick={() => {
          if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.clear();
            navigate('/start');
          }
        }}
      >
        <img src={'assets/img/main/logout.svg'} />
      </button>
      <button
        className="setting"
        onClick={() => {
          setPasswordCheckModalState([profileList[0].userId, '/parent']);
        }}
      >
        <img src={'assets/img/main/setting.svg'} />
      </button>

      <div style={{ display: 'flex' }}>
        <button
          onClick={() => {
            customAxios
              .get(`/notification/send-test/aea81011-0743-4423-8c41-170ff790a5f9`)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          sse테스트 send-test
        </button>
        <button
          onClick={() => {
            customAxios
              .put(`/notification/read`)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          sse테스트 read
        </button>
        <button
          onClick={() => {
            customAxios
              .get(`/notification`)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          sse테스트 get
        </button>
        <button
          onClick={() => {
            customAxios
              .get(`/notification/`)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          sse테스트 delete
        </button>
      </div>

      <div className="main">
        <div className="main__title">
          <img src={'assets/img/main/profile.svg'} />
        </div>
        <div className="main__profilelist-wrapper">
          {!isLoading ? (
            <div className="main__profilelist">
              {profileList.length > 0 &&
                profileList.slice(1).map((it, idx) => (
                  <div
                    className={`main__profilelist-item ${selectedUser === it.userId ? 'selected' : ''}`}
                    key={it.userId}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(it.userId);
                    }}
                  >
                    <div
                      className="main__profilelist-item-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        userStore.setUserDino(it.userDino);
                        userStore.setUserNickname(it.userNickname);
                        setEditProfileModalState(it.userId);
                      }}
                    >
                      <img src={'assets/img/main/editProfileIcon.svg'} />
                    </div>
                    <button
                      className="main__profilelist-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalOpenState([it.userId, setProfileList]);
                      }}
                    >
                      <img src={'assets/img/main/deleteicon.svg'} />
                    </button>
                    <div className="main__profilelist-item-dino">
                      <img src={`assets/dino/${it.userDino}/${it.userDino}.png`} alt="캐릭터" />
                    </div>
                    <div className="main__profilelist-item-title">{it.userName}</div>
                    <div className="main__profilelist-item-nickname">{it.userNickname}</div>
                  </div>
                ))}
              <div className="main__profilelist-empty">
                <button
                  onClick={() => {
                    userStore.setUserId(profileList[0].userId);
                    navigate('/addProfile');
                  }}
                >
                  <img src={'assets/img/main/addProfile.svg'} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="main__button">
          <button
            className="main__button-start"
            onClick={() => {
              if (!selectedUser) return;
              setPasswordCheckModalState([selectedUser, '/child']);
            }}
          >
            START!
          </button>
        </div>
      </div>
    </S.Container>
  );
}
