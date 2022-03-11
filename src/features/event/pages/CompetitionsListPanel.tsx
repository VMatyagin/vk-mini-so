import { FC, useContext, useMemo, useState } from "react";
import {
  Panel,
  PanelHeaderBack,
  SimpleCell,
  PanelProps,
  ScreenSpinner,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Competition } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { useRoute } from "react-router5";
import { useQuery } from "react-query";
import { routerStore } from "../../stores/router-store";
import { Icon12Favorite } from "@vkontakte/icons";

export const CompetitionsListPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { openPopout, closePopout } = useContext(routerStore);
  const eventId = useMemo(() => route.params.eventId, [route]);

  const [selectedId, selectId] = useState<null | number>(null);
  useQuery({
    queryKey: ["event", selectedId],
    queryFn: ({ queryKey }) => {
      openPopout(<ScreenSpinner />);
      return EventAPI.getCompetition(queryKey[1] as number);
    },
    onSuccess: (data: Competition) => {
      closePopout();
      navigate("else.competition.details", {
        competitionId: data.id,
      });
    },
    onError: closePopout,
    retry: false,
    enabled: !!selectedId,
    refetchOnWindowFocus: false,
  });
  const changeView = (competitionId: number) => {
    selectId(competitionId);
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Конкурсы и соревнования
        </Title>
      </PanelHeader>
      <LazyList
        title="Конкурсы и соревнования"
        fetchFn={EventAPI.getEventCompetitions}
        queryKey={`competitions-list-${eventId}`}
        extraFnProp={{
          eventId,
        }}
        pullToRefresh
        enabled={!!eventId}
        renderItem={(item: Competition) => (
          <SimpleCell
            key={item.id}
            onClick={() => changeView(item.id)}
            badge={!item.ratingless ? <Icon12Favorite /> : null}
          >
            {item.title}
          </SimpleCell>
        )}
      />
      {/* TODO */}
      {/* {event?.canEdit && (
                <Group>
                    <SimpleCell
                        onClick={() => {
                            navigate("else.competitions.create", {
                                eventId
                            });
                        }}
                    >
                        Добавить конкурс
                    </SimpleCell>
                </Group>
            )} */}
    </Panel>
  );
});
