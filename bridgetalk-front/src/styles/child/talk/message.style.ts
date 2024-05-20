import styled from 'styled-components';

export const Container = styled.div`
  .message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10svh;

    &__content {
      width: 60svw;
      height: 60svh;
      padding: 5svh;

      border-radius: 5svh;
      background-color: #ffffff;
      box-shadow: 0 1svh 1svh #00000050;
    }

    &__reader {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5svw;

      &-icons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5svh;
        transition: opacity 3s;

        &-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 7svw;
          height: 7svw;
          padding: 1svh;
          background-color: white;
          border-radius: 70%;
          box-shadow: 3px 3px 3px #00000050;

          img {
            width: 80%;
          }
        }
      }

      &-dino {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;

        width: 20svw;
        height: 60svh;
      }

      &-talk {
        width: 40svw;
        height: 60svh;
        padding: 10svh 5svw;
        border-radius: 5svh;
        background-color: #ffffff;
        box-shadow: 0 1svh 1svh #00000050;
        overflow: auto;
        font-size: 4svh;
        line-height: 7svh;

        h3 {
          font-family: 'DNF';
        }

        p {
          font-size: 2svh;
        }

        hr {
          margin: 3svh 0;
        }
      }
    }
  }
`;
