import { FC, useContext, useMemo } from "react";
import {
  Group,
  Header,
  InfoRow,
  Panel,
  PanelHeaderBack,
  ScreenSpinner,
  SimpleCell,
  Title,
  PanelProps,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Icon28Like, Icon28UserAddOutline } from "@vkontakte/icons";
import { useMutation, useQuery } from "react-query";
import { Boec, Brigade, CompetitionParticipant } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { COMPETITIVE_PARTICIPANT_TITLES } from "../helpers";
import { MODAL_BOEC_SELECTING } from "../../boec/ui/modals/BoecSelectModal";
import { MODAL_BRIGADE_SELECTING } from "../../brigades/ui/modals/BrigadeSelectModal";
import { MODAL_EVENT_PARTICIPANT_TITLE } from "../ui/modals/ParticipantTitleModal";
import { useRoute, useRouter } from "react-router5";

export const CompetitionViewPanel: FC<PanelProps> = observer((props) => {
  const { openPopout, closePopout, openModal, setModalCallback } =
    useContext(routerStore);
  const { route } = useRoute();
  const { navigate } = useRouter();

  const { competitionId } = useMemo(() => route.params, [route]);

  const { data, refetch } = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: ({ queryKey }) => {
      return EventAPI.getCompetition(queryKey[1] as number);
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!competitionId,
  });
  const { mutate } = useMutation<
    CompetitionParticipant,
    Error,
    {
      boecIds: number[];
      brigadeIds: number[] | undefined;
      title: string;
    }
  >(
    ({ boecIds, brigadeIds, title }) => {
      openPopout(<ScreenSpinner />);

      return EventAPI.createCompetitionParticipant({
        boecIds,
        brigadeIds,
        competitionId: competitionId!,
        title,
      });
    },
    {
      onSuccess: () => {
        closePopout();
        refetch();
      },
      onError: closePopout,
    }
  );
  const brigadeSelectCallback = (data: {
    boecIds: number[];
    brigadeIds: number[] | undefined;
    title: string;
  }) => {
    mutate(data);
  };
  const boecSelectCallback = ({
    boecList,
    title,
  }: {
    boecList: Boec[];
    title: string;
  }) => {
    setModalCallback(
      MODAL_BRIGADE_SELECTING,
      ({
        boecList,
        brigades,
        title,
      }: {
        brigades: Brigade[];
        boecList: Boec[];
        title: string;
      }) =>
        brigadeSelectCallback({
          boecIds: boecList.map((item) => item.id),
          brigadeIds:
            brigades.length > 0 ? brigades.map((item) => item.id) : undefined,
          title,
        })
    );
    openModal(MODAL_BRIGADE_SELECTING, { title, boecList });
  };
  const createParticipant = () => {
    setModalCallback(
      MODAL_EVENT_PARTICIPANT_TITLE,
      ({ title }: { title: string }) => {
        openModal(MODAL_BOEC_SELECTING, { title });
        setModalCallback(MODAL_BOEC_SELECTING, boecSelectCallback);
      }
    );
    openModal(MODAL_EVENT_PARTICIPANT_TITLE);
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {data?.title}
        </Title>
      </PanelHeader>
      <Group header={<Header mode="secondary">Информация о конкурсе</Header>}>
        <SimpleCell
          onClick={() =>
            navigate("else.competition.participants", {
              competitionId,
            })
          }
        >
          <InfoRow header={COMPETITIVE_PARTICIPANT_TITLES[0].plural}>
            {data?.participantCount}
          </InfoRow>
        </SimpleCell>
        <SimpleCell
          onClick={() =>
            navigate("else.competition.involvements", {
              competitionId,
            })
          }
        >
          <InfoRow header={COMPETITIVE_PARTICIPANT_TITLES[1].plural}>
            {data?.involvementCount}
          </InfoRow>
        </SimpleCell>
        <SimpleCell
          onClick={() =>
            navigate("else.competition.winners", {
              competitionId,
            })
          }
        >
          <InfoRow header={COMPETITIVE_PARTICIPANT_TITLES[2].plural}>
            {data?.winnerCount}
          </InfoRow>
        </SimpleCell>
        <SimpleCell
          onClick={() =>
            navigate("else.competition.not-winners", {
              competitionId,
            })
          }
        >
          <InfoRow header={COMPETITIVE_PARTICIPANT_TITLES[3].plural}>
            {data?.notwinnerCount}
          </InfoRow>
        </SimpleCell>
        {data?.canEdit && (
          <>
            <SimpleCell
              onClick={() =>
                navigate("else.competition.edit", {
                  competitionId,
                })
              }
            >
              Редактировать
            </SimpleCell>
          </>
        )}
      </Group>
      <Group header={<Header mode="secondary">Заявки</Header>}>
        <SimpleCell
          before={<Icon28UserAddOutline />}
          onClick={createParticipant}
        >
          Подать заявку
        </SimpleCell>
      </Group>
      <Group header={<Header mode="secondary">Номинации</Header>}>
        <SimpleCell
          before={<Icon28Like />}
          onClick={() =>
            navigate("else.competition.nominations", {
              competitionId,
            })
          }
        >
          Список номинаций
        </SimpleCell>
      </Group>
    </Panel>
  );
});
