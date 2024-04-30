import styled, { css, keyframes } from 'styled-components';
import { color, embossing } from '../parent/common.style';

const fadeInWithMove = keyframes`
    0% {
        transform: translateY(3svh);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
`;
const fadeOutWithMove = keyframes`
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-3svh);
        opacity: 0;
    }
`;

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
`;

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
`;

export const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${fadeIn} 0.5s ease-in-out;

    background-color: ${color(0.7).dark};
`;

const shadow = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    pointer-events: none;
`;

export const AudioContainer = styled.div`
    width: 60svw;
    /* height: 30svh; */
    background-color: ${color(1).sub};
    border-radius: 1svw;
    gap: 2svh;
    padding: 2svw 2svw;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    animation: ${fadeInWithMove} 0.5s ease-in-out;

    box-shadow: 0 0.5svh 0.4svh ${color(0.5).dark};

    position: relative;

    &::after {
        ${shadow}
        border-radius: 1svw;
        box-shadow: inset 0 0.5svh 0.4svh ${color(0.5).bright};
    }

    &::before {
        ${shadow}
        border-radius: 1svw;
        box-shadow: inset 0 -0.5svh 0.4svh ${color(0.25).dark};
    }

    .title {
        font-family: 'DNF';
        color: ${color(1).bright};
        font-size: 3svw;
    }

    .audio {
        width: 100%;
        height: 10svh;
    }

    .buttons {
        button {
            font-family: 'CherryBomb';
            padding: 2svh 2svw;
            font-size: 5svh;
            border-radius: 2svw;
            cursor: pointer;
            color: ${color(1).bright};

            box-shadow: 0 0.5svh 0.4svh ${color(1).dark};
            position: relative;
            border: none;

            &::before {
                ${shadow}
                border-radius: 2svw;
                box-shadow: inset 0 0.5svh 0.4svh ${color(0.5).bright};
            }

            &::after {
                ${shadow}
                border-radius: 2svw;
                box-shadow: inset 0 -0.5svh 0.4svh ${color(0.25).dark};
            }
        }

        .close {
            background-color: ${color(1).red};

            &::after {
                ${shadow}
                border-radius: 2svw;
                /* box-shadow: ; */
            }
        }

        .send {
            background-color: ${color(1).main};
        }
    }
`;