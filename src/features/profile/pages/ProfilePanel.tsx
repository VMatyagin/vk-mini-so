import { FC, useContext, useEffect, useState } from "react";
import {
    Avatar,
    Counter,
    Group,
    Header,
    // HorizontalScroll,
    Panel,
    PanelHeaderButton,
    PanelProps,
    SimpleCell,
    // Tabs,
    // TabsItem,
    Title
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { Icon28Notifications } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { appStore } from "../../stores/app-store";
import { Achievements } from "../ui/organisms/Achievements";
import { Statistics } from "../ui/organisms/Statistics";
import { Missions } from "../ui/organisms/Missions";
import { profileStore } from "../store";
import { useRouter } from "react-router5";

export const ProfilePanel: FC<PanelProps> = observer(props => {
    const { userData, user } = useContext(appStore);
    const { load } = useContext(profileStore);
    useEffect(() => {
        load();
    }, [load]);
    const { navigate } = useRouter();

    const openNotifications = () => {
        navigate("profile.notifications");
    };

    const [
        activeTab
        // setActiveTab
    ] = useState<string>("stat");

    return (
        <Panel {...props}>
            <PanelHeader
                left={
                    <PanelHeaderButton onClick={openNotifications}>
                        <Icon28Notifications />
                        {(user?.unreadActivityCount ?? 0) > 0 && (
                            <Counter size="s" mode="prominent">
                                {user?.unreadActivityCount}
                            </Counter>
                        )}
                    </PanelHeaderButton>
                }
            >
                <Title level="2" weight="bold">
                    Профиль
                </Title>
            </PanelHeader>
            <Group
                style={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 32
                    }}
                >
                    <Avatar src={userData?.photo_200} size={96} />
                    <Title style={{ marginTop: 20 }} level="2" weight="1">
                        {`${user?.boec.firstName} ${user?.boec.lastName[0]}.`}{" "}
                    </Title>
                </div>

                <SimpleCell
                    onClick={() =>
                        navigate("else.boec.details", { boecId: user?.boec.id })
                    }
                    expandable={true}
                >
                    Подробнее
                </SimpleCell>
            </Group>
            <Group header={<Header>Статистика</Header>}>
                {/* <Tabs>
                    <HorizontalScroll>
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
                    </HorizontalScroll>
                </Tabs> */}
                {activeTab === "missions" && <Missions />}
                {activeTab === "achievements" && <Achievements />}
                {activeTab === "stat" && <Statistics />}
            </Group>
        </Panel>
    );
});
