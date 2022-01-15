import { FC } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  SimpleCell,
  PanelProps,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { LazyList } from "../../../ui/organisms/LazyList";
import { EventType } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { useRouter } from "react-router5";

const getDescription = ({
  date,
  place,
}: {
  date?: string | null;
  place?: string | null;
}) => {
  let description = "";
  if (date) {
    description += new Date(date).toLocaleString("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  if (place) {
    description += `| ${place}`;
  }

  return description;
};

export const EventListPanel: FC<PanelProps> = observer((props) => {
  const { navigate } = useRouter();
  const changeView = (eventId: number) => {
    navigate("else.event.details", { eventId });
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Мероприятия
        </Title>
      </PanelHeader>
      <Group>
        <LazyList
          withSearch={true}
          title="Предстоящие мероприятия"
          fetchFn={EventAPI.getEventList}
          queryKey={"event-list"}
          renderItem={(item: EventType) => (
            <SimpleCell
              key={item.id}
              onClick={() => changeView(item.id)}
              description={getDescription({
                date: item.startDate,
                place: item.location,
              })}
            >
              {`${item.title} | ${item.shtab?.title || "Без организатора"}`}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
