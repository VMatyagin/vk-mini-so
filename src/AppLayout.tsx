import React, { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
    Epic,
    Root,
    View,
    Tabbar,
    TabbarItem,
    ModalRoot,
    usePlatform,
    useAdaptivity,
    ViewWidth,
    VKCOM,
    SplitCol,
    SplitLayout,
    PanelHeader,
    Panel,
    Group,
    Cell,
} from "@vkontakte/vkui";
import {
    Icon28CalendarOutline,
    Icon28CompassOutline,
    Icon28Newsfeed,
    Icon28WalletOutline,
} from "@vkontakte/icons";

import { CalendarPanelBase } from "./features/calendar/pages/CalendarPanelBase";
import { CalendarInfoModal } from "./features/calendar/organisms/modals/CalendarInfoModal";
import { WalletPanelBase } from "./features/wallet/pages/WalletPanelBase";
import { ElsePanelBase } from "./ui/panels/else/ElsePanelBase";
import { EventHandlePanel } from "./ui/panels/else/event-handle/EventHandlePanel";
import { AddPanel } from "./ui/panels/else/event-handle/AddPanel";
import { SearchPanel } from "./ui/panels/else/event-handle/SearchPanel";
import { EventPagePanel } from "./ui/panels/else/event-handle/EventPagePanel";
import { WalletPanel } from "./ui/panels/else/event-handle/WalletPanel";
import { ElseWalletCountModal } from "./features/wallet/organisms/modals/ElseWalletCountModal";
import { AdminsPanel } from "./ui/panels/else/event-handle/AdminsPanel";
import { EventUsers } from "./ui/panels/else/event-handle/EventUsers";
import { EventWinners } from "./ui/panels/else/event-handle/EventWinners";
import { EventQRModal } from "./features/wallet/organisms/modals/EventQRModal";

import { useMst } from "./features/stores";
import { UsersListView } from "./features/users/pages/UsersListView";
import { UsersView } from "./features/users/pages/UserView";

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

export const AppLayout: FC<AppInitialProps> = observer((props) => {
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

    const modals = (
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
    const platform = usePlatform();
    const { viewWidth = 100 } = useAdaptivity();

    const isDesktop = viewWidth >= ViewWidth.TABLET;
    const hasHeader = platform !== VKCOM;

    return (
        <SplitLayout
            header={hasHeader && <PanelHeader separator={false} />}
            style={{ justifyContent: "center" }}
        >
            {isDesktop && (
                <SplitCol fixed width="280px" maxWidth="280px">
                    <Panel>
                        {hasHeader && <PanelHeader />}
                        <Group>
                            <Cell
                                disabled={activeStory === "users"}
                                style={
                                    activeStory === "users"
                                        ? {
                                              backgroundColor:
                                                  "var(--button_secondary_background)",
                                              borderRadius: 8,
                                          }
                                        : {}
                                }
                                onClick={() =>
                                    store.router.setStory("users", "base")
                                }
                                before={<Icon28CompassOutline />}
                            >
                                Отряды
                            </Cell>
                            <Cell
                                disabled={activeStory === "calendar"}
                                style={
                                    activeStory === "calendar"
                                        ? {
                                              backgroundColor:
                                                  "var(--button_secondary_background)",
                                              borderRadius: 8,
                                          }
                                        : {}
                                }
                                onClick={() =>
                                    store.router.setStory("calendar", "base")
                                }
                                before={<Icon28CalendarOutline />}
                            >
                                Календарь
                            </Cell>
                            <Cell
                                disabled={activeStory === "wallet"}
                                style={
                                    activeStory === "wallet"
                                        ? {
                                              backgroundColor:
                                                  "var(--button_secondary_background)",
                                              borderRadius: 8,
                                          }
                                        : {}
                                }
                                onClick={() =>
                                    store.router.setStory("wallet", "base")
                                }
                                before={<Icon28WalletOutline />}
                            >
                                Билеты
                            </Cell>
                            <Cell
                                disabled={activeStory === "else"}
                                style={
                                    activeStory === "else"
                                        ? {
                                              backgroundColor:
                                                  "var(--button_secondary_background)",
                                              borderRadius: 8,
                                          }
                                        : {}
                                }
                                onClick={() =>
                                    store.router.setStory("else", "base")
                                }
                                before={<Icon28Newsfeed />}
                            >
                                Ещё
                            </Cell>
                        </Group>
                    </Panel>
                </SplitCol>
            )}

            <SplitCol
                animate={!isDesktop}
                spaced={isDesktop}
                width={isDesktop ? "560px" : "100%"}
                maxWidth={isDesktop ? "560px" : "100%"}
            >
                <Epic
                    activeStory={activeStory}
                    tabbar={
                        !isDesktop && (
                            <Tabbar itemsLayout="vertical">
                                <TabbarItem
                                    text="Отряды"
                                    onClick={() =>
                                        store.router.setStory("users", "base")
                                    }
                                    selected={activeStory === "users"}
                                >
                                    <Icon28CompassOutline />
                                </TabbarItem>
                                <TabbarItem
                                    onClick={() =>
                                        store.router.setStory(
                                            "calendar",
                                            "base"
                                        )
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
                        )
                    }
                >
                    <Root id="users" activeView={activeView} popout={popout}>
                        <UsersListView id="users" />
                        <UsersView id="user" />
                    </Root>
                    <Root id="calendar" activeView={activeView} popout={popout}>
                        <View
                            id="calendar"
                            activePanel={store.router.getActivePanel(
                                "calendar"
                            )}
                            history={history}
                            modal={modals}
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
                            modal={modals}
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
                            modal={modals}
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
                            modal={modals}
                            onSwipeBack={() => goBack()}
                        >
                            <EventHandlePanel id="base" />
                            <AddPanel id="event_add" />
                            <SearchPanel id="event_search" />
                            <EventPagePanel id="event_page" />
                            <WalletPanel id="event_page_wallets" />
                            <AdminsPanel id="event_page_admins" />
                            <EventUsers id="event_admins" type="admins" />
                            <EventUsers
                                id="event_volunteers"
                                type="volunteers"
                            />
                            <EventUsers
                                id="event_page_artists"
                                type="artists"
                            />
                            <EventWinners id="event_page_winners" />
                        </View>
                    </Root>
                </Epic>
            </SplitCol>
        </SplitLayout>
    );
});
