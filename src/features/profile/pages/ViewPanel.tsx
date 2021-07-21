import { FC, useContext, useState } from "react";
import {
    Avatar,
    CellButton,
    Counter,
    Group,
    Panel,
    Tabs,
    TabsItem,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import {
    Icon28Notifications,
    Icon28UserStarBadgeOutline,
} from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { appStore } from "../../stores/app-store";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";
import { Achievements } from "../ui/organisms/Achievements";
import { Statistics } from "../ui/organisms/Statistics";
import { Missions } from "../ui/organisms/Missions";

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { setStory, setPage } = useContext(routerStore);
    const { userData, user } = useContext(appStore);
    const [activeTab, setActiveTab] = useState<string>("missions");
    const openNotifications = () => {
        setPage(viewId, "notifications");
    };
    return (
        <Panel id={id}>
            <PanelHeader>
                <Title level="2" weight="bold">
                    Профиль
                </Title>
            </PanelHeader>
            <Group
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 32,
                    }}
                >
                    <Avatar src={userData?.photo_200} size={96} />
                    <Title style={{ marginTop: 20 }} level="2" weight="medium">
                        {`${user?.boec.firstName} ${user?.boec.lastName[0]}.`}{" "}
                    </Title>
                </div>

                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <CellButton
                        onClick={() => setStory("else", "base", "boec")}
                        before={<Icon28UserStarBadgeOutline />}
                        style={{
                            flex: 1,
                        }}
                        centered={true}
                    >
                        К бойцовской странице
                    </CellButton>
                    <CellButton
                        style={{
                            flex: 1,
                        }}
                        before={<Icon28Notifications />}
                        centered={true}
                        indicator={
                            user!.unreadActivityCount > 0 && (
                                <Counter size="s" mode="prominent">
                                    {user?.unreadActivityCount}
                                </Counter>
                            )
                        }
                        onClick={openNotifications}
                    >
                        Уведомления
                    </CellButton>
                </div>
            </Group>
            <Group>
                <Tabs>
                    <TabsItem
                        onClick={() => setActiveTab("missions")}
                        selected={activeTab === "missions"}
                    >
                        Задачи
                    </TabsItem>
                    <TabsItem
                        onClick={() => setActiveTab("achievements")}
                        selected={activeTab === "achievements"}
                    >
                        Достижения
                    </TabsItem>
                    <TabsItem
                        onClick={() => setActiveTab("stat")}
                        selected={activeTab === "stat"}
                    >
                        Статистика
                    </TabsItem>
                </Tabs>
                {activeTab === "missions" && <Missions />}
                {activeTab === "achievements" && <Achievements />}
                {activeTab === "stat" && <Statistics />}
            </Group>
        </Panel>
    );
});
