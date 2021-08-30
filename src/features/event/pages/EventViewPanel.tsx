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
  const id = 1;
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["event", id],
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
    // navigate(`else.event.${url}`);
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
              <CellButton onClick={() => openPage("edit")}>
                Редактировать
              </CellButton>
            )}
          </Group>

          {haveAccess && (
            <>
              <Group header={<Header mode="secondary">Списки</Header>}>
                <SimpleCell
                  before={<Icon28FireOutline />}
                  onClick={() => openPage("organizers")}
                >
                  Организаторы
                </SimpleCell>
                <SimpleCell
                  before={<Icon28UsersOutline />}
                  onClick={() => openPage("volonteers")}
                >
                  Волонтеры
                </SimpleCell>
                <SimpleCell
                  onClick={() => openPage("participants")}
                  before={<Icon28UsersOutline />}
                >
                  Участники
                </SimpleCell>
                <SimpleCell
                  onClick={() => openPage("quotas")}
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
                onClick={() => openPage("competitions")}
                before={<Icon28Flash />}
              >
                Конкурсы
              </SimpleCell>
            </Group>
          )}
          <Group>
            {user!.brigades.length > 0 && (
              <SubjectSelectingCell
                onBrigadeClick={(id) =>
                  openPage("brigade-participants", {
                    brigadeId: id,
                  })
                }
                onlyBrigades={true}
              >
                {({ handleClick, ref }) => (
                  <SimpleCell
                    getRootRef={ref}
                    onClick={handleClick}
                    before={<Icon28UsersOutline />}
                  >
                    Заявки моего отряда
                  </SimpleCell>
                )}
              </SubjectSelectingCell>
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
