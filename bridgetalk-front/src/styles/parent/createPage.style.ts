import styled from 'styled-components';
import { color } from './common.style';

export const Container = styled.div`
  * {
    font-family: 'Pretendard';
    font-size: 1svw;
  }

  display: flex;
  justify-content: center;
  align-items: start;

  width: 100%;
  height: 100%;
  padding: 2svh 2svw;

  background-color: ${color(1).bright};

  .createPage {
    display: flex;
    flex-direction: column;
    gap: 2svh;
    width: 40svw;
    height: 100svh;

    &__header {
      display: flex;
      align-items: center;

      width: 100%;
      height: 5svh;

      &-toBack {
        background-color: transparent;

        cursor: pointer;
        border: none;

        img {
          width: 2svw;
        }
      }
    }

    &__container {
      display: flex;
      flex-direction: column;
      gap: 2svh;

      height: 100%;
      width: 100%;

      &-title {
        width: 100%;

        display: flex;
        gap: 1svw;

        div {
          font-size: 2svw;
        }

        input {
          width: 100%;

          font-size: 2svw;

          outline: none;
          border: none;
        }
      }

      &-report {
        display: flex;
        flex-direction: column;
        gap: 1svh;

        &-title {
          text-align: center;
          font-size: 1.5svw;
        }

        &-content {
          display: flex;
          flex-direction: column;

          &-btn {
            cursor: pointer;
          }
        }
      }
      &-content {
        textarea {
          width: 100%;
          resize: none;
          height: 30svh;
          padding: 2svh 1svw;
          font-size: 1.3svw;
        }
      }

      &-btns {
        width: 100%;

        button {
          width: 100%;

          background-color: ${color(1).bright};
          padding: 2svh 1svw;
          border-radius: 1svw;

          cursor: pointer;

          &:hover {
            background-color: ${color(1).black};
            color: ${color(1).bright};
          }
        }
      }
    } //contaienr
  }
`;
