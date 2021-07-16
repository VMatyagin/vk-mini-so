import { FC, useContext, useState } from "react";
import {
    Avatar,
    CellButton,
    Counter,
    Group,
    InfoRow,
    Panel,
    SimpleCell,
    Tabs,
    TabsItem,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import {
    Icon28DrillOutline,
    Icon28FireOutline,
    Icon28Notifications,
    Icon28PaletteOutline,
    Icon28SneakerOutline,
    Icon28UserStarBadgeOutline,
} from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { appStore } from "../../stores/app-store";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";
import { Mission } from "../ui/molecules/Mission";

const Missions = () => {
    return (
        <>
            <Mission
                Icon={<Icon28DrillOutline />}
                title="Крутой орг!"
                goal="Организовать 1 мероприятие"
                level={1}
                value={1}
                maxValue={1}
            />
            <Mission
                Icon={<Icon28SneakerOutline />}
                title="Качок"
                goal="Занять призовое место в спортивном мероприятии"
                level={1}
                value={0}
                maxValue={1}
            />
            <Mission
                Icon={<Icon28PaletteOutline />}
                title="Еще ничего!"
                goal="Занять призовое место в творческом мероприятии"
                level={1}
                value={0}
                maxValue={1}
            />

            <Mission
                Icon={<Icon28FireOutline />}
                title="Молодой боец"
                goal="Выехать на свой первый сезон"
                level={1}
                value={0}
                maxValue={1}
            />
        </>
    );
};
const Achievements = () => {
    return (
        <>
            <Mission
                Icon={<Icon28DrillOutline />}
                title="Крутой орг!"
                goal="Организовать 1 мероприятие"
                level={1}
                value={1}
                maxValue={1}
                done={true}
            />
            <Mission
                Icon={<Icon28SneakerOutline />}
                title="Качок"
                goal="Занять призовое место в спортивном мероприятии"
                level={1}
                value={0}
                maxValue={1}
                done={true}
            />
            <Mission
                Icon={<Icon28PaletteOutline />}
                title="Еще ничего!"
                goal="Занять призовое место в творческом мероприятии"
                level={1}
                value={0}
                maxValue={1}
                done={true}
            />

            <Mission
                Icon={<Icon28FireOutline />}
                title="Молодой боец"
                goal="Выехать на свой первый сезон"
                level={1}
                value={0}
                maxValue={1}
                done={true}
            />
        </>
    );
};

const Statistics = () => (
    <>
        <SimpleCell multiline>
            <InfoRow header="Участвовал в конкурсном мероприятии">5</InfoRow>
        </SimpleCell>
        <SimpleCell>
            <InfoRow header="Был волонтером на мероприятии">{4}</InfoRow>
        </SimpleCell>
        <SimpleCell>
            <InfoRow header="Был организатором мероприятия">{0}</InfoRow>
        </SimpleCell>
    </>
);
export const ViewPanel: FC<PanelProps> = observer(({ id }) => {
    const { setStory } = useContext(routerStore);

    const { userData, user } = useContext(appStore);

    const [activeTab, setActiveTab] = useState<string>("missions");

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
                            <Counter size="s" mode="prominent">
                                12
                            </Counter>
                        }
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
