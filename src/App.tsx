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
import { initApp, getUserData } from "./feature/VKBridge";
import Icon28Newsfeed from "@vkontakte/icons/dist/28/newsfeed";
import Icon28WalletOutline from "@vkontakte/icons/dist/28/wallet_outline";
import Icon28CalendarOutline from "@vkontakte/icons/dist/28/calendar_outline";
import Icon28CompassOutline from "@vkontakte/icons/dist/28/compass_outline";
import { HomePanelBase } from "./ui/panels/home/HomePanelBase";
import { CalendarPanelBase } from "./ui/panels/calendar/CalendarPanelBase";
import { CalendarInfoModal } from "./ui/modals/CalendarInfoModal";
import { WalletPanelBase } from "./ui/panels/wallet/WalletPanelBase";
import { EventQRModal } from "./ui/modals/EventQRModal";
import { ElsePanelBase } from "./ui/panels/else/ElsePanelBase";
import { EventHandlePanel } from "./ui/panels/else/event-handle/EventHandlePanel";
import { EventAddPanel } from "./ui/panels/else/event-handle/EventAddPanel";
import { EventSearchPanel } from "./ui/panels/else/event-handle/EventSearchPanel";
import { EventPagePanel } from "./ui/panels/else/event-handle/EventPagePanel";
import { EventPageWalletPanel } from "./ui/panels/else/event-handle/EventPageWalletPanel";
import { ElseWalletCountModal } from "./ui/modals/ElseWalletCountModal";

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
    lastAndroidBackAction: [
        number,
        React.Dispatch<React.SetStateAction<number>>
    ];
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
            scrollPosition[
                activeStory + "_" + activeView + "_" + activePanel
            ] || 0;
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
            <Epic
                activeStory={activeStory}
                tabbar={
                    <Tabbar itemsLayout="vertical">
                        <TabbarItem
                            onClick={() =>
                                store.router.setStory("home", "base")
                            }
                            selected={activeStory === "home"}
                            text="Главная"
                        >
                            <Icon28Newsfeed />
                        </TabbarItem>
                        <TabbarItem text="Отряды">
                            <Icon28CompassOutline />
                        </TabbarItem>
                        <TabbarItem
                            onClick={() =>
                                store.router.setStory("calendar", "base")
                            }
                            selected={activeStory === "calendar"}
                            text="Календарь"
                        >
                            <Icon28CalendarOutline />
                        </TabbarItem>
                        <TabbarItem
                            onClick={() =>
                                store.router.setStory("wallet", "base")
                            }
                            selected={activeStory === "wallet"}
                            text="Билеты"
                        >
                            <Icon28WalletOutline />
                        </TabbarItem>
                        <TabbarItem
                            onClick={() =>
                                store.router.setStory("else", "base")
                            }
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
                        activePanel={store.router.getActivePanel(
                            "else_event_handle"
                        )}
                        history={history}
                        modal={calenderModals}
                        onSwipeBack={() => goBack()}
                    >
                        <EventHandlePanel id="base" />
                        <EventAddPanel id="event_add" />
                        <EventSearchPanel id="event_search" />
                        <EventPagePanel id="event_page" />
                        <EventPageWalletPanel id="event_page_wallets" />
                    </View>
                </Root>
            </Epic>
        </ConfigProvider>
    );
});
