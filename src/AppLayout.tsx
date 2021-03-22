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

import { ElseWalletCountModal } from "./features/wallet/organisms/modals/ElseWalletCountModal";

import { EventQRModal } from "./features/wallet/organisms/modals/EventQRModal";

import { useMst } from "./features/stores";
import { UsersListView } from "./features/users/pages/UsersListView";
import { UsersView } from "./features/users/pages/UserView";
import { ElseView } from "./features/else/pages/ElseView";
import { EventHandlingView } from "./features/event/EventHandlingView";
import { RatingView } from "./features/rating/RatingView";

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
    const { viewWidth = 3 } = useAdaptivity();

    const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;
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
                        <ElseView id="else" />
                        <EventHandlingView id="else_event_handle" />
                        <RatingView id="else_rating" />
                    </Root>
                </Epic>
            </SplitCol>
        </SplitLayout>
    );
});
