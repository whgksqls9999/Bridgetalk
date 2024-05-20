import styled, { css } from 'styled-components';
import { color, textShadowBlue } from './common.style';
import { insetShadow } from '../main/common.style';

const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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

  .boardPage {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 2svh;

    width: 40svw;
    height: 100svh;

    &__categories {
      display: flex;
      gap: 1svw;
      height: 5svh;

      button {
        font-size: 1.5svw;

        color: ${color(1).black};
        background-color: ${color(1).bright};

        border: 1px solid ${color(1).line};
        border-radius: 0.5svw;
        padding: 1svh 0.5svw;

        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: ${color(1).bright};
          background-color: ${color(1).black};
        }

        &:active {
          color: ${color(1).black};
          background-color: ${color(1).bright};
        }
      }

      .active {
        background-color: ${color(1).black};

        color: ${color(1).bright};
      }
    }

    &__search {
      padding: 1.8svh 1.5svw;
      border-top: 2px solid ${color(1).black};
      border-bottom: 2px solid ${color(1).black};

      &-form {
        display: flex;
        align-content: center;
        justify-content: space-between;
        gap: 1svw;

        input {
          width: 100%;
          font-size: 1.7svw;

          border: none;
          outline: none;
        }

        button {
          padding: 1svh 0.5svw;

          border-radius: 0.5svw;
          border: 1px solid ${color(1).line};
          background-color: transparent;

          cursor: pointer;

          img {
            width: 1.7svw;
          }
        }
      }
    }

    &__list {
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      gap: 3svh;

      height: 67svh;

      &-item {
        cursor: pointer;

        display: flex;
        flex-direction: column;
        gap: 1svh;
        width: 100%;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &-header {
          display: flex;
          justify-content: space-between;

          &-first {
            display: flex;
            flex-direction: column;
            gap: 1svh;

            &-title {
              font-size: 2svw;
              width: 100%;
              ${truncate}
            }

            &-sub {
              display: flex;
              gap: 0.5svw;
            }
          }
        }

        &-body {
          &-content {
            ${truncate}
          }
          &-keywords {
            display: flex;
            justify-content: end;
            gap: 1svw;
          }
        }
      }
    }
    .pagenation {
      display: flex;
      gap: 1svw;
      justify-content: center;

      .active {
        /* background-color: ${color(1).bright}; */
        border: 2px solid ${color(1).black};
      }

      button {
        width: 3svw;
        height: 3svw;

        border: none;
        border-radius: 1svw;

        font-family: 'Pretendard';
        font-size: 1.5svw;

        cursor: pointer;

        transition: all 0.2s;
        background-color: ${color(1).bright};
        border: 1px solid ${color(1).line};
      } //.active
    } // .pagenation
  } // .boardPage

  .sort {
    position: absolute;
    top: 10svh;
    right: 0;
    transform: translateX(100%);

    padding: 0 1svw;

    display: flex;
    flex-direction: column;
    gap: 1svh;

    button {
      background-color: transparent;
      border: none;

      color: ${color(1).line};
      cursor: pointer;

      font-size: 1.5svw;
      &:hover {
        color: ${color(1).black};
      }
    }
  } // .sort

  .write {
    position: absolute;
    right: 2svw;
    bottom: 4svh;

    padding: 3svh 1.5svw;

    border-radius: 50%;

    cursor: pointer;

    background-color: transparent;

    img {
      width: 3.6svw;
    }
  } // .write
`;
