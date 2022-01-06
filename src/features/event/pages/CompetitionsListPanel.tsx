import { FC, useMemo } from "react";
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
import { Competition } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { useRoute } from "react-router5";
import { useQuery } from "react-query";

export const CompetitionsListPanel: FC<PanelProps> = observer((props) => {
  const { route, router } = useRoute();
  const eventId = useMemo(() => route.params.eventId, [route]);

  const changeView = (competitionId: number) => {
    router.navigate("else.competition.details", { eventId, competitionId });
  };
  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ queryKey }) => {
      return EventAPI.getEvent(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Конкурсы
        </Title>
      </PanelHeader>
      <Group>
        <LazyList
          title="Конкурсы"
          fetchFn={EventAPI.getEventCompetitions}
          queryKey={`competitions-list-${eventId}`}
          extraFnProp={{
            eventId,
          }}
          enabled={!!eventId}
          renderItem={(item: Competition) => (
            <SimpleCell key={item.id} onClick={() => changeView(item.id)}>
              {item.title}
            </SimpleCell>
          )}
        />
      </Group>
      {event?.canEdit && (
        <Group>
          <SimpleCell
            onClick={() => {
              router.navigate("else.competitions.create", {
                eventId,
              });
            }}
          >
            Добавить конкурс
          </SimpleCell>
        </Group>
      )}
    </Panel>
  );
});
