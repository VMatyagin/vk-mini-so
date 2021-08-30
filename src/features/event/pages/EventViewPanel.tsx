import { FC, useContext, useMemo } from "react";
import {
  CellButton,
  Group,
  Header,
  InfoRow,
  Panel,
  PanelHeaderBack,
  PanelProps,
  PanelSpinner,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import {
  Icon28BillheadOutline,
  Icon28FireOutline,
  Icon28Flash,
  Icon28UsersOutline,
} from "@vkontakte/icons";
import { useMutation, useQuery } from "react-query";
import { Participant, User } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { EVENT_WORTH } from "../helpers";
import { appStore } from "../../stores/app-store";
import { SubjectSelectingCell } from "../../else/ui/molecules/SubjectSelectingCell";
import { useRoute, useRouter } from "react-router5";

const canEdit = ({
  user,
  acceptedIds,
}: {
  user: User;
  acceptedIds: {
    shtab?: number[];
    brigade?: number[];
  };
}) => {
  let can = false;

  if (acceptedIds.brigade) {
    can =
      acceptedIds.brigade.filter((id) =>
        user!.brigades.map((brigade) => brigade.id).includes(id)
      ).length > 0;
  }

  if (!can && acceptedIds.shtab) {
    can =
      acceptedIds.shtab.filter((id) =>
        user!.shtabs.map((shtab) => shtab.id).includes(id)
      ).length > 0;
  }
  if (user.isStaff) {
    can = true;
  }
  return can;
};

export const EventViewPanel: FC<PanelProps> = observer((props) => {
  const { user } = useContext(appStore);
  const { route } = useRoute();
  const eventId = useMemo(() => route.params.eventId, [route]);

  const { navigate } = useRouter();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ queryKey }) => {
      return EventAPI.getEvent(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const haveAccess = useMemo(
    () =>
      canEdit({
        user: user!,
        acceptedIds: {
          shtab: [data?.shtabId!],
        },
      }),
    [data, user]
  );

  const { mutate } = useMutation<
    Participant,
    Error,
    {
      boecId: number;
      eventId: number;
      worth: Participant["worth"];
      brigadeId: number;
    }
  >(
    (data) => {
      return EventAPI.setParticipant(data);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const onWannaBeParticipang = (brigadeId: number) => {
    mutate({
      eventId: data!.id,
      boecId: user!.boec.id,
      worth: 0,
      brigadeId,
    });
  };

  const openPage = (url: string, additional?: Record<string, number>) => {
    navigate(`else.event.${url}`, { ...additional });
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
      {isLoading && <PanelSpinner />}
      {!isLoading && (
        <>
          <Group
            header={<Header mode="secondary">Информация о мероприятии</Header>}
          >
            <SimpleCell>
              <InfoRow header="Штаб-организатор">
                {data?.shtab?.title || "Без организатора"}
              </InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Блок рейтинга">
                {EVENT_WORTH[data?.worth || 0].title}
              </InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Дата проведения">
                {new Date(data?.startDate!).toLocaleString("ru", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Время проведения">
                {data?.startTime?.slice(0, -3) || "Не указано"}
              </InfoRow>
            </SimpleCell>
            {haveAccess && (
              <CellButton
                onClick={() =>
                  openPage("edit", {
                    eventId,
                  })
                }
              >
                Редактировать
              </CellButton>
            )}
          </Group>

          {haveAccess && (
            <>
              <Group header={<Header mode="secondary">Списки</Header>}>
                <SimpleCell
                  before={<Icon28FireOutline />}
                  onClick={() => openPage("organizers", { eventId })}
                >
                  Организаторы
                </SimpleCell>
                <SimpleCell
                  before={<Icon28UsersOutline />}
                  onClick={() => openPage("volonteers", { eventId })}
                >
                  Волонтеры
                </SimpleCell>
                <SimpleCell
                  onClick={() => openPage("participants", { eventId })}
                  before={<Icon28UsersOutline />}
                >
                  Участники
                </SimpleCell>
                <SimpleCell
                  onClick={() => openPage("quotas", { eventId })}
                  before={<Icon28BillheadOutline />}
                >
                  Квоты
                </SimpleCell>
              </Group>
            </>
          )}
          {data && [1, 2].includes(data.worth) && (
            <Group header={<Header mode="secondary">Конкурсная часть</Header>}>
              <SimpleCell
                onClick={() =>
                  navigate(`else.competitions.base`, {
                    eventId,
                  })
                }
                before={<Icon28Flash />}
              >
                Конкурсы
              </SimpleCell>
            </Group>
          )}
          <Group>
            {user!.brigades.length > 0 && (
              <SimpleCell
                onClick={() =>
                  openPage("brigade-participants", {
                    eventId,
                  })
                }
                before={<Icon28UsersOutline />}
              >
                Заявки моего отряда
              </SimpleCell>
            )}
            {data &&
              data.isTicketed &&
              (!data?.isParticipant ? (
                <SubjectSelectingCell
                  onBrigadeClick={onWannaBeParticipang}
                  onlyBrigades={true}
                  isForBoec={true}
                >
                  {({ handleClick, ref }) => (
                    <CellButton getRootRef={ref} onClick={handleClick}>
                      Подать заявку на участие в мероприятии
                    </CellButton>
                  )}
                </SubjectSelectingCell>
              ) : (
                <CellButton disabled={true}>
                  Заявка на участие подана
                </CellButton>
              ))}
          </Group>
        </>
      )}
    </Panel>
  );
});
