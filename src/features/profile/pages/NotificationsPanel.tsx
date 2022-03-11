import { FC, ReactNode, useEffect } from "react";
import {
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  PanelProps,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import {
  Icon28ErrorCircleOutline,
  Icon28Favorite,
  Icon28WarningTriangleOutline,
} from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { Activity } from "../../types";
import { useQuery, useQueryClient } from "react-query";
import { UsersAPI } from "../../utils/requests/user-request";
import { LazyList } from "../../../ui/organisms/LazyList";

const getTitle = (item: Activity) => {
  if (item.type === 0) {
    return item.warning!.text;
  }
  if (item.type === 1) {
    return item.warning!.text;
  }
  if (item.type === 2) {
    return `Вы заработали достижение "${item.achievement?.title}"`;
  }
};
const getBefore = (item: Activity): ReactNode => {
  if (item.type === 0) {
    return <Icon28ErrorCircleOutline />;
  }
  if (item.type === 1) {
    return <Icon28WarningTriangleOutline />;
  }
  if (item.type === 2) {
    return <Icon28Favorite />;
  }
};

const getTime = (item: string) => {
  const dateObj = new Date(item);
  const isCurrentYear = dateObj.getFullYear() === new Date().getFullYear();
  const date = dateObj.toLocaleString("ru", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: isCurrentYear ? undefined : "numeric",
  });
  const time = dateObj.toLocaleString("ru", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} в ${time}`;
};

export const NotificationsPanel: FC<PanelProps> = observer((props) => {
  const qClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["user-activity"],
    queryFn: () => UsersAPI.getActivities({ limit: 20, offset: 0 }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.items.length) {
      UsersAPI.ActivietisMarkAsRead();
      qClient.refetchQueries(["user-me"]);
    }
  }, [data, qClient]);

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Уведомления
        </Title>
      </PanelHeader>
      {data && data.items.length > 0 && (
        <Group header={<Header mode="secondary">Новые</Header>}>
          {data.items.map((item) => (
            <SimpleCell
              before={getBefore(item)}
              description={getTime(item.createdAt)}
              multiline
            >
              {getTitle(item)}
            </SimpleCell>
          ))}
        </Group>
      )}
      <Group>
        <LazyList
          title={"Просмотрено"}
          fetchFn={UsersAPI.getActivities}
          queryKey={`user-activity-past`}
          extraFnProp={{
            seen: true,
          }}
          pullToRefresh
          renderItem={(item) => (
            <SimpleCell
              before={getBefore(item)}
              description={getTime(item.createdAt)}
              multiline
            >
              {getTitle(item)}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
