import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  ConfigProvider,
  Epic,
  Root,
  View,
  Tabbar,
  TabbarItem,
  ModalRoot,
} from "@vkontakte/vkui";
import { useMst } from "./feature/stores";
import { initApp, getUserData, getAuthToken } from "./feature/VKBridge";

import { HomePanelBase } from "./ui/panels/home/HomePanelBase";
import { CalendarPanelBase } from "./ui/panels/calendar/CalendarPanelBase";
import { CalendarInfoModal } from "./ui/modals/CalendarInfoModal";
import { WalletPanelBase } from "./ui/panels/wallet/WalletPanelBase";
import { EventQRModal } from "./ui/modals/EventQRModal";
import { ElsePanelBase } from "./ui/panels/else/ElsePanelBase";
import { EventHandlePanel } from "./ui/panels/else/event-handle/EventHandlePanel";
import { AddPanel } from "./ui/panels/else/event-handle/AddPanel";
import { SearchPanel } from "./ui/panels/else/event-handle/SearchPanel";
import { EventPagePanel } from "./ui/panels/else/event-handle/EventPagePanel";
import { WalletPanel } from "./ui/panels/else/event-handle/WalletPanel";
import { ElseWalletCountModal } from "./ui/modals/ElseWalletCountModal";
import { AdminsPanel } from "./ui/panels/else/event-handle/AdminsPanel";
import { EventUsers } from "./ui/panels/else/event-handle/EventUsers";
import { EventWinners } from "./ui/panels/else/event-handle/EventWinners";
import { AppLoadingPanel } from "./ui/panels/AppLoadingPanel";
import { strapi } from "./feature/utils/api.service";
import {
  Icon28CalendarOutline,
  Icon28CompassOutline,
  Icon28Newsfeed,
  Icon28WalletOutline,
} from "@vkontakte/icons";

export const App: FC = observer(({ children }) => {
  const lastAndroidBackAction = useState<number>(0);
  const store = useMst();

  const {
    setStory,
    goBack,
    scrollPosition,
    activePanel,
    activeStory,
    activeView,
  } = store.router;
  useEffect(() => {
    setStory("else", "base");
    initApp();
    getUserData();
  }, [setStory]);

  useEffect(() => {
    const devFetch = async () => {
      const userObject = {
        id: 1,
        last_name: "test",
        first_name: "test",
        photo: "test",
      };
      store.app.setUserData(userObject);
      store.app.setSoData({
        position: "Кент",
        level: "1",
        id: 0,
      });
      store.app.setLoading(false);
    };
    const fetch = async () => {
      await getUserData()
        .then(async (data) => {
          const userObject = {
            id: data.id,
            last_name: data.last_name,
            first_name: data.first_name,
            photo: data.photo_max_orig ? data.photo_max_orig : data.photo_200,
          };
          const bdId = (await strapi.init({ ...userObject })) as number;
          store.app.setUserData(userObject);
          getAuthToken(["groups"]);

          store.app.setSoData({
            position: "Кент",
            level: "1",
            id: bdId,
          });
          store.app.setLoading(false);
        })
        .catch(() => {
          store.app.setUserData({
            id: 0,
            last_name: "Ошибка загрузки",
            first_name: "",
            photo: "",
          });
        });
    };
    devFetch();
    // fetch();
  }, [store.app]);

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
  useEffect(() => {
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

  const calenderModals = (
    <ModalRoot activeModal={activeModal}>
      <CalendarInfoModal
        id="MODAL_CALENDAR_INFO"
        onClose={() => store.router.closeModal()}
      />
      <EventQRModal
        id="MODAL_WALLET_QR"
        onClose={() => store.router.closeModal()}
      />
      <ElseWalletCountModal
        id="MODAL_ELSE_WALLET_COUNT"
        onClose={() => store.router.closeModal()}
      />
    </ModalRoot>
  );
  return (
    <ConfigProvider scheme={store.app.colorSchema}>
      {store.app.loading ? (
        <View activePanel="app_loading">
          <AppLoadingPanel id="app_loading" />
        </View>
      ) : (
        <Epic
          activeStory={activeStory}
          tabbar={
            <Tabbar itemsLayout="vertical">
              <TabbarItem
                onClick={() => store.router.setStory("home", "base")}
                selected={activeStory === "home"}
                text="Главная"
              >
                <Icon28Newsfeed />
              </TabbarItem>
              <TabbarItem text="Отряды">
                <Icon28CompassOutline />
              </TabbarItem>
              <TabbarItem
                onClick={() => store.router.setStory("calendar", "base")}
                selected={activeStory === "calendar"}
                text="Календарь"
              >
                <Icon28CalendarOutline />
              </TabbarItem>
              <TabbarItem
                onClick={() => store.router.setStory("wallet", "base")}
                selected={activeStory === "wallet"}
                text="Билеты"
              >
                <Icon28WalletOutline />
              </TabbarItem>
              <TabbarItem
                onClick={() => store.router.setStory("else", "base")}
                selected={activeStory === "else"}
                text="Ещё"
              >
                <Icon28Newsfeed />
              </TabbarItem>
            </Tabbar>
          }
        >
          <Root id="home" activeView={activeView} popout={popout}>
            <View
              id="home"
              activePanel={store.router.getActivePanel("home")}
              history={history}
              onSwipeBack={() => goBack()}
            >
              <HomePanelBase id="base" />
            </View>
          </Root>
          <Root id="calendar" activeView={activeView} popout={popout}>
            <View
              id="calendar"
              activePanel={store.router.getActivePanel("calendar")}
              history={history}
              modal={calenderModals}
              onSwipeBack={() => goBack()}
            >
              <CalendarPanelBase id="base" />
            </View>
          </Root>
          <Root id="wallet" activeView={activeView} popout={popout}>
            <View
              id="wallet"
              activePanel={store.router.getActivePanel("wallet")}
              history={history}
              modal={calenderModals}
              onSwipeBack={() => goBack()}
            >
              <WalletPanelBase id="base" />
            </View>
          </Root>
          <Root id="else" activeView={activeView} popout={popout}>
            <View
              id="else"
              activePanel={store.router.getActivePanel("else")}
              history={history}
              modal={calenderModals}
              onSwipeBack={() => goBack()}
            >
              <ElsePanelBase id="base" />
            </View>
            <View
              id="else_event_handle"
              activePanel={store.router.getActivePanel("else_event_handle")}
              history={history}
              modal={calenderModals}
              onSwipeBack={() => goBack()}
            >
              <EventHandlePanel id="base" />
              <AddPanel id="event_add" />
              <SearchPanel id="event_search" />
              <EventPagePanel id="event_page" />
              <WalletPanel id="event_page_wallets" />
              <AdminsPanel id="event_page_admins" />
              <EventUsers id="event_admins" type="admins" />
              <EventUsers id="event_volunteers" type="volunteers" />
              <EventUsers id="event_page_artists" type="artists" />
              <EventWinners id="event_page_winners" />
            </View>
          </Root>
        </Epic>
      )}
    </ConfigProvider>
  );
});
