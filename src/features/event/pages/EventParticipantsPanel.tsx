import { FC, useContext, useMemo } from "react";
import {
  ActionSheet,
  ActionSheetItem,
  CellButton,
  Group,
  IOS,
  Panel,
  PanelHeaderBack,
  PanelProps,
  ScreenSpinner,
  SimpleCell,
  usePlatform,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Boec, Participant } from "../../types";
import { LazyList } from "../../../ui/organisms/LazyList";
import { EventAPI } from "../../utils/requests/event-request";
import { useMutation, useQueryClient } from "react-query";
import {
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import { PARTICIPANT_TITLES } from "../helpers";
import { MODAL_BOEC_LIST } from "../../boec/ui/modals/BoecListModal";
import { useRoute } from "react-router5";

interface ParticipantsPanelProps extends PanelProps {
  worth: Participant["worth"];
}

export const EventParticipantsPanel: FC<ParticipantsPanelProps> = observer(
  ({ worth, ...props }) => {
    const { route } = useRoute();
    const eventId = useMemo(() => route.params.eventId, [route]);
    const { setModalCallback, openModal, openPopout, closeModal, closePopout } =
      useContext(routerStore);
    const queryClient = useQueryClient();

    const { mutate } = useMutation<
      Participant,
      Error,
      {
        boecId: number;
        eventId: number;
        worth: Participant["worth"];
      }
    >(
      (data) => {
        closeModal();
        openPopout(<ScreenSpinner />);
        return EventAPI.setParticipant({
          isApproved: true,
          ...data,
        });
      },
      {
        onSuccess: () => {
          closePopout();
          queryClient.refetchQueries(`event-${eventId}`);
        },
        onError: closePopout,
      }
    );

    const { mutate: removeParticipant } = useMutation<
      Participant,
      Error,
      {
        participantId: Participant["worth"];
        eventId: number;
      }
    >(
      ({ participantId, eventId }) => {
        closeModal();
        openPopout(<ScreenSpinner />);
        return EventAPI.removeParticipant({
          participantId,
          eventId,
        });
      },
      {
        onSuccess: () => {
          closePopout();
          queryClient.refetchQueries(`event-${eventId}`);
        },
        onError: closePopout,
      }
    );

    const onAddClick = () => {
      setModalCallback(MODAL_BOEC_LIST, (boec: Boec) => {
        mutate({
          boecId: boec.id,
          eventId: eventId!,
          worth,
        });
      });
      openModal(MODAL_BOEC_LIST);
    };
    const platform = usePlatform();

    const handleOpenActionSheet = (
      event: React.MouseEvent,
      data: Participant
    ) => {
      openPopout(
        <ActionSheet
          onClose={closePopout}
          toggleRef={event.currentTarget}
          iosCloseItem={
            <ActionSheetItem autoclose mode="cancel">
              Отменить
            </ActionSheetItem>
          }
        >
          <ActionSheetItem
            autoclose
            before={
              platform === IOS ? (
                <Icon28DeleteOutline />
              ) : (
                <Icon28DeleteOutlineAndroid />
              )
            }
            mode="destructive"
            onClick={() =>
              removeParticipant({
                eventId: data.eventId,
                participantId: data.id,
              })
            }
          >
            Удалить
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
            {PARTICIPANT_TITLES[worth].title}
          </Title>
        </PanelHeader>
        <Group>
          <CellButton onClick={onAddClick}>Добавить</CellButton>
        </Group>
        <LazyList
          title={PARTICIPANT_TITLES[worth].title}
          fetchFn={EventAPI.getEventParticipants}
          queryKey={`event-${eventId}`}
          extraFnProp={{
            eventId: eventId!,
            worth,
          }}
          enabled={!!eventId}
          renderItem={(item: Participant) => {
            const brigadeTitle = item.brigade?.title
              ? `(${item.brigade?.title})`
              : "";
            return (
              <SimpleCell
                key={item.id}
                onClick={(event) => handleOpenActionSheet(event, item)}
              >
                {`${item.boec.fullName} ${brigadeTitle}`}
              </SimpleCell>
            );
          }}
        />
      </Panel>
    );
  }
);
