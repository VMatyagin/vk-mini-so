import React, { FC, useContext, useMemo } from "react";
import {
  ActionSheet,
  ActionSheetItem,
  Button,
  Counter,
  Div,
  Group,
  InfoRow,
  Panel,
  PanelHeaderBack,
  PanelProps,
  PullToRefresh,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import {
  Icon28EditOutline,
  Icon28ShareExternal,
  Icon28ShareOutline,
  Icon28UsersOutline,
} from "@vkontakte/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { EventAPI } from "../../utils/requests/event-request";
import { EVENT_WORTH } from "../helpers";
import { useRoute, useRouter } from "react-router5";
import { EventImage } from "../ui/atoms/EventImage";
import { sendTapticNotification } from "../../VKBridge";
import { routerStore } from "../../stores/router-store";
import { getDateString } from "../../utils/getDateString";
export const EventViewPanel: FC<PanelProps> = observer((props) => {
  const { openPopout, closePopout } = useContext(routerStore);
  const { route } = useRoute();
  const eventId = useMemo(() => route.params.eventId, [route]);

  const { navigate } = useRouter();
  const {
    data: event,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ queryKey }) => {
      return EventAPI.getEvent(queryKey[1] as number);
    },
    retry: false,
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const openPage = (url: string, additional?: Record<string, number>) => {
    navigate(`else.event.${url}`, { ...additional });
  };
  const queryClient = useQueryClient();

  const { mutate, isLoading: isParticipantStatusLoading } = useMutation({
    mutationFn: () =>
      event?.isParticipant
        ? EventAPI.wontGo(eventId)
        : EventAPI.wantGo(eventId),
    onSuccess: (data) => {
      queryClient.setQueryData(["event", eventId], data);
      sendTapticNotification("success");
    },
  });

  const onParticipantClick = (e: React.MouseEvent) => {
    if (event?.isParticipant && event?.isTicketed) {
      openPopout(
        <ActionSheet
          header="Отменив участие, вы потеряете приглашение"
          onClose={closePopout}
          iosCloseItem={
            <ActionSheetItem autoclose mode="cancel">
              Отменить
            </ActionSheetItem>
          }
          toggleRef={e.currentTarget}
        >
          <ActionSheetItem onClick={() => mutate()} autoclose>
            Отменить участие
          </ActionSheetItem>
        </ActionSheet>
      );
    } else {
      mutate();
    }
  };
  const onShareClick = (e: React.MouseEvent) => {
    openPopout(
      <ActionSheet
        onClose={closePopout}
        iosCloseItem={
          <ActionSheetItem autoclose mode="cancel">
            Закрыть
          </ActionSheetItem>
        }
        toggleRef={e.currentTarget}
      >
        {event?.canEdit && (
          <>
            <ActionSheetItem
              before={<Icon28EditOutline />}
              autoclose
              onClick={() =>
                openPage("edit", {
                  eventId,
                })
              }
            >
              Редактировать
            </ActionSheetItem>
            <ActionSheetItem
              before={<Icon28UsersOutline />}
              autoclose
              onClick={() => openPage("organizers", { eventId })}
            >
              Организаторы
            </ActionSheetItem>
            <ActionSheetItem
              before={<Icon28UsersOutline />}
              autoclose
              onClick={() => openPage("volonteers", { eventId })}
            >
              Волонтеры
            </ActionSheetItem>
          </>
        )}

        <ActionSheetItem autoclose before={<Icon28ShareOutline />}>
          Скопировать ссылку TODO
        </ActionSheetItem>
      </ActionSheet>
    );
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {event?.title}
        </Title>
      </PanelHeader>
      <PullToRefresh onRefresh={refetch} isFetching={isLoading}>
        <Group>
          <Div style={{ paddingTop: 10, paddingBottom: 10 }}>
            <EventImage />
          </Div>
          <Div
            style={{
              display: "flex",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Button
              onClick={onParticipantClick}
              loading={isParticipantStatusLoading}
              disabled={isParticipantStatusLoading}
              size="l"
              appearance={event?.isParticipant ? "negative" : "accent"}
              stretched
              style={{ borderRadius: 20 }}
            >
              {event?.isParticipant ? "Не пойду" : "Пойду"}
            </Button>
            <Button
              onClick={onShareClick}
              size="l"
              mode="secondary"
              style={{
                marginLeft: "12px",
                width: 60,
                borderRadius: 20,
              }}
              before={<Icon28ShareExternal />}
            />
          </Div>
          <Div
            style={{
              display: "flex",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Button
              style={{ borderRadius: 20 }}
              size="l"
              mode="outline"
              stretched
              onClick={() => openPage("participants", { eventId })}
              children={"Участники"}
              disabled={!event?.canEdit}
              after={
                <Counter
                  mode="prominent"
                  children={event?.participantCount}
                  size="s"
                />
              }
            />
            {event?.isTicketed && (
              <Button
                style={{ marginLeft: "12px", borderRadius: 20 }}
                size="l"
                mode="outline"
                stretched
                after={<Counter mode="prominent" children={300} size="s" />}
              >
                Билеты
              </Button>
            )}
          </Div>
          {event && [1, 2].includes(event.worth) && (
            <Div
              style={{
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Button
                style={{ borderRadius: 20 }}
                size="l"
                mode="outline"
                stretched
                onClick={() =>
                  navigate(`else.competitions.base`, {
                    eventId,
                  })
                }
                children={"Конкурсы и соревнования"}
              />
            </Div>
          )}

          {event?.description && (
            <SimpleCell multiline disabled>
              <InfoRow header="Описание">{event?.description}</InfoRow>
            </SimpleCell>
          )}
          {event?.shtab && (
            <SimpleCell
              disabled
              indicator={event.shtab.title}
              children="Штаб-организатор"
            />
          )}
          <SimpleCell
            disabled
            indicator={EVENT_WORTH[event?.worth || 0].title}
            children="Блок рейтинга"
          />
          <SimpleCell
            disabled
            indicator={event?.visibility ? "Доступен" : "По приглашению"}
            children="Доступность"
          />
          <SimpleCell
            disabled
            indicator={getDateString(event?.startDate, event?.startTime)}
            children="Дата"
          />
        </Group>
      </PullToRefresh>
    </Panel>
  );
});
