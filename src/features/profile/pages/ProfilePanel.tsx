import { FC, useContext, useEffect, useState } from "react";
import {
  Avatar,
  Counter,
  Group,
  HorizontalScroll,
  Panel,
  PanelHeaderButton,
  PanelProps,
  SimpleCell,
  Tabs,
  TabsItem,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { Icon28Notifications } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { appStore } from "../../stores/app-store";
import { Achievements } from "../ui/organisms/Achievements";
import { Statistics } from "../ui/organisms/Statistics";
import { Missions } from "../ui/organisms/Missions";
import { profileStore } from "../store";

export const ProfilePanel: FC<PanelProps> = observer((props) => {
  const { userData, user } = useContext(appStore);
  const { load } = useContext(profileStore);
  useEffect(() => {
    load();
  }, [load]);
  // const history = useHistory();
  const [activeTab, setActiveTab] = useState<string>("missions");
  const openNotifications = () => {
    // history.push("/profile/notifications");
  };

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

        <SimpleCell
          // onClick={() => navigate("boec", { id: user?.boec.id })}
          expandable={true}
        >
          К бойцовской странице
        </SimpleCell>
      </Group>
      <Group>
        <Tabs>
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
        </Tabs>
        {activeTab === "missions" && <Missions />}
        {activeTab === "achievements" && <Achievements />}
        {activeTab === "stat" && <Statistics />}
      </Group>
    </Panel>
  );
});
