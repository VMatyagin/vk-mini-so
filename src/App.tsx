import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  ConfigProvider,
  Epic,
  Root,
  View,
  Tabbar,
  TabbarItem,
  Panel,
  PanelHeader,
} from "@vkontakte/vkui";
import { useMst } from "./feature/stores";
import { initApp } from "./feature/VKBridge";
import Icon28Newsfeed from "@vkontakte/icons/dist/28/newsfeed";
import Icon28More from "@vkontakte/icons/dist/28/more";
import { getActivePanel } from "./feature/utils";
import { PanelTemplate } from "./ui/panels/template/PanelTemplate";
import { HomePanelBase } from "./ui/panels/home/HomePanelBase";

export const App: FC = observer(({ children }) => {
  const lastAndroidBackAction = useState<number>(0);
  const {
    setStory,
    goBack,
    scrollPosition,
    activePanel,
    activeStory,
    activeView,
  } = useMst().router;
  useEffect(() => {
    setStory("home", "base");
  }, [setStory]);
  return (
    <AppInner
      lastAndroidBackAction={lastAndroidBackAction}
      goBack={goBack}
      activePanel={activePanel}
      activeView={activeView}
      activeStory={activeStory}
      scrollPosition={scrollPosition}
    >
      {children}
    </AppInner>
  );
});

interface AppInitialProps {
  lastAndroidBackAction: [number, React.Dispatch<React.SetStateAction<number>>];
  goBack: () => void;
  activeView: string;
  activeStory: string;
  activePanel: string;
  scrollPosition: { [key: string]: number };
}

export const AppInner: FC<AppInitialProps> = observer((props) => {
  const {
    lastAndroidBackAction,
    goBack,
    activeView,
    activeStory,
    activePanel,
    scrollPosition,
  } = props;
  console.log(props);

  useEffect(() => {
    initApp();
    window.onpopstate = () => {
      const [last, setLast] = lastAndroidBackAction;
      let timeNow = +new Date();
      if (timeNow - last > 500) {
        setLast(timeNow);
        goBack();
      } else {
        window.history.pushState(null, "");
      }
    };
  }, [lastAndroidBackAction, goBack]);

  useEffect(() => {
    let pageScrollPosition =
      scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;
    window.scroll(0, pageScrollPosition);
  }, [activePanel, activeStory, activeView, scrollPosition]);

  const store = useMst();

  let history =
    store.router.panelsHistory[activeView] === undefined
      ? [activeView]
      : store.router.panelsHistory[activeView];
  let popout =
    store.router.popouts[activeView] === undefined
      ? null
      : store.router.popouts[activeView];
  let activeModal =
    store.router.activeModals[activeView] === undefined
      ? null
      : store.router.activeModals[activeView];

  return (
    <ConfigProvider isWebView={true} scheme={store.app.colorSchema}>
      <Epic
        activeStory={activeStory}
        tabbar={
          <Tabbar>
            <TabbarItem
              onClick={() => store.router.setStory("home", "base")}
              selected={activeStory === "home"}
              text="Главная"
            >
              <Icon28Newsfeed />
            </TabbarItem>
            {/* <TabbarItem
              onClick={() => store.router.setStory("more", "callmodal")}
              selected={activeStory === "more"}
            >
              <Icon28More />
            </TabbarItem> */}
          </Tabbar>
        }
      >
        <Root id="home" activeView={activeView} popout={popout}>
          <View
            id="home"
            activePanel={getActivePanel("home")}
            history={history}
            onSwipeBack={() => goBack()}
          >
            <HomePanelBase id="base" />
          </View>
        </Root>
        <Root id="more" activeView={activeView} popout={popout}>
          <View
            id="more"
            activePanel={getActivePanel("more")}
            history={history}
            onSwipeBack={() => goBack()}
          >
            <Panel id={"callmodal"}>
              <PanelHeader>Examples 2</PanelHeader>
            </Panel>
          </View>
        </Root>
      </Epic>
    </ConfigProvider>
  );
});
