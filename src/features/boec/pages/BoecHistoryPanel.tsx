import {
  Footer,
  Group,
  Header,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelSpinner,
  SimpleCell,
  PanelProps,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";
import { useQuery } from "react-query";
import { useRoute } from "react-router5";
import { PARTICIPANT_WORTH } from "../../event/helpers";

import { Competition, Nomination } from "../../types";
import { UsersAPI } from "../../utils/requests/user-request";

const getText = (
  competition: Competition,
  title: string | null,
  nomination: Nomination[]
) => {
  let text = "";

  if (competition) {
    text += competition.title;
  }

  if (title) {
    text += ` ${title}`;
  }

  if (nomination) {
    nomination.forEach((item) => {
      text += ` | ${item.title}`;
    });
  }

  return text;
};

export const BoecHistoryPanel: FC<PanelProps> = observer((props) => {
  const { route } = useRoute();
  const { boecId } = useMemo(() => route.params, [route]);
  const { data } = useQuery({
    queryKey: ["user-history", boecId],
    queryFn: () => UsersAPI.getBoecHistory(boecId!),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!boecId,
  });

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        Участие
      </PanelHeader>
      {!data && <PanelSpinner />}
      {data && (
        <Group header={<Header mode="secondary">В мероприятиях</Header>}>
          {data.eventParticipant.length === 0 && (
            <Footer>Ничего не найдено</Footer>
          )}
          {data.eventParticipant.map((participant) => (
            <SimpleCell
              key={`${participant.event.title}-${participant.worth}`}
              description={PARTICIPANT_WORTH[participant.worth].title}
            >
              {participant.event.title}
            </SimpleCell>
          ))}
        </Group>
      )}
      {data && (
        <Group
          header={<Header mode="secondary">В конкурсах и соревнованиях</Header>}
        >
          {data.competitionParticipant.length === 0 && (
            <Footer>Ничего не найдено</Footer>
          )}
          {data.competitionParticipant.map((participant) => (
            <SimpleCell
              key={`${participant.event.title}-${participant.worth}`}
              description={participant.event.title}
            >
              {getText(
                participant.competition,
                participant.title,
                participant.nomination
              )}
            </SimpleCell>
          ))}
        </Group>
      )}
    </Panel>
  );
});
