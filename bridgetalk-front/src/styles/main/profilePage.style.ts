import styled from 'styled-components';
import { button, color, insetShadow } from './common.style';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100svw;
  height: 100svh;
  padding: 5svh 0;
  background-color: ${color(0.2).black};

  /* ::-webkit-scrollbar {
    display: none;
  } */

  .logout {
    position: fixed;
    top: 3svh;
    left: 2svw;
    border: none;
    background-color: transparent;

    cursor: pointer;

    img {
      width: 7svw;
    }
  }

  .setting {
    position: fixed;
    top: 3svh;
    right: 3svw;
    background-color: transparent;
    border: none;

    cursor: pointer;
    img {
      width: 5.8svw;
    }
  }

  display: flex;
  flex-direction: column;
  gap: 2svh;

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5.5svh;

    &__title {
      img {
        width: 30svw;
      }
    }

    &__profilelist {
      .selected {
        background-color: ${color(1).main};
      }
      &-wrapper {
        max-width: 80svw;
        overflow-x: auto;
        overflow-y: visible;
        position: relative;

        &-left {
          position: absolute;
          top: 0;
          left: 0;
          width: 5svw;
          height: 100%;

          transform: translateX(-5svw);
          background-color: ${color(1).main};

          z-index: 1;
        }

        &-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 10svw;
          height: 100%;
          background-color: ${color(0.5).main};
        }
      }

      display: flex;
      align-items: center;
      justify-content: start;
      gap: 3.1svw;

      &-item {
        &-edit {
          background-color: transparent;
          border: none;
          position: absolute;
          top: 2svw;
          right: 2svw;

          img {
            width: 1svw;
          }
        }

        &-delete {
          background-color: transparent;
          border: none;
          position: absolute;
          top: 2svw;
          left: 2svw;

          img {
            width: 2svw;
          }
        }
      }

      &-item,
      &-empty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        min-width: 20.8svw;

        background-color: ${color(1).sub};
        height: 30svw;
        border-radius: 3svw;
        padding: 2svw;

        position: relative;
        box-shadow: 0 0.5svh 0.4svh ${color(0.25).black};

        cursor: pointer;

        &:hover {
          box-shadow: inset 0 0 2svh ${color(1).white};
        }

        button {
          background-color: transparent;
          border: none;
        }

        &::after {
          ${insetShadow}
          border-radius: 3svw;
          box-shadow: inset 0 0.5svh 0.4svh ${color(0.5).white};
        }

        &::before {
          ${insetShadow}
          border-radius: 3svw;
          box-shadow: inset 0 -0.5svh 0.4svh ${color(0.25).black};
        }

        &-dino {
          img {
            width: 11svw;
          }
        }

        &-title {
          color: ${color(1).white};
          font-family: 'DNF';
          font-size: 1.6svw;
        }

        &-nickname {
          color: ${color(1).white};
          font-family: 'DNF';
          font-size: 2.7svw;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
      }

      &-empty {
        button {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        img {
          width: 5.5svw;
        }
      }
    }

    &__button {
      &-start {
        ${button}
        width: 20.9svw;
        height: 12svh;
        font-size: 2.5svw;

        cursor: pointer;
      }
    }
  }
`;

export const ProfilelistItem = styled.div<{ idx: number }>``;
