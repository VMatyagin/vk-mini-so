import { PanelProps, Spinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
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

export const IntroPanel: FC<PanelProps> = observer((props) => {
  return (
    <LogoWrapper>
      <Logo />
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    </LogoWrapper>
  );
});
