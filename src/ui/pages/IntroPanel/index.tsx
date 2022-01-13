import { Panel, PanelProps, Spinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";
import { useRouter } from "react-router5";
import styled from "styled-components";
import { appStore } from "../../../features/stores/app-store";
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
  const { isInitialization, user } = useContext(appStore);
  const router = useRouter();
  useEffect(() => {
    if (isInitialization === false && user?.boec !== null) {
      router.navigate("else.base.base");
    }
    if (isInitialization === false && user?.boec === null) {
      router.navigate("init.onboarding");
    }
  }, [isInitialization, router, user?.boec]);

  return (
    <Panel {...props}>
      <LogoWrapper>
        <Logo />
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </LogoWrapper>
    </Panel>
  );
});
