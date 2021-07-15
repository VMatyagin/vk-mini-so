import { Spinner } from "@vkontakte/vkui";
import styled from "styled-components";
import { Logo } from "../../atom/Logo";

const LogoWrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    position: relative;
`;

const SpinnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 50px;
    height: auto;
`;

export const Intro = () => (
    <LogoWrapper>
        <Logo />
        <SpinnerWrapper>
            <Spinner />
        </SpinnerWrapper>
    </LogoWrapper>
);
