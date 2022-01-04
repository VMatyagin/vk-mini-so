import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActionSheet,
  ActionSheetItem,
  Group,
  InfoRow,
  IOS,
  Panel,
  PanelHeaderBack,
  PanelProps,
  PanelSpinner,
  ScreenSpinner,
  SimpleCell,
  Tabs,
  TabsItem,
  usePlatform,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import {
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import { useQueryClient, useMutation } from "react-query";
import { MODAL_BOEC_LIST } from "../../boec/ui/modals/BoecListModal";
import { routerStore } from "../../stores/router-store";
import { Participant, Boec } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { useRoute } from "react-router5";
import { LazyList } from "../../../ui/organisms/LazyList";

export const EventBrigadeParticipantsPanel: FC<PanelProps> = observer(
  (props) => {
    const {
      setModalCallback,
      openModal,
      openPopout,
      closeModal,
      closePopout,
      popout,
    } = useContext(routerStore);
    const queryClient = useQueryClient();
    const { route } = useRoute();
    const { eventId } = route.params;
    const [activeTab, setActiveTab] = useState<"notapproved" | "approved">(
      "notapproved"
    );
    const [brigadeId] = useState<number>();
    // const { user } = useContext(appStore);

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
        closeModal();
        openPopout(<ScreenSpinner />);
        return EventAPI.setParticipant(data);
      },
      {
        onSuccess: () => {
          closePopout();
          queryClient.refetchQueries(`event-${eventId}-${brigadeId}`);
        },
        onError: closePopout,
      }
    );

    const { mutate: approveParticipant } = useMutation<
      Participant,
      Error,
      {
        participantId: Participant["worth"];
        eventId: number;
      }
    >(
      ({ participantId, eventId }) => {
        openPopout(<ScreenSpinner />);
        return EventAPI.approveParticipant({
          participantId,
          eventId,
        });
      },
      {
        onSuccess: () => {
          closePopout();
          queryClient.refetchQueries(`event-${eventId}-${brigadeId}`);
        },
        onError: closePopout,
      }
    );
    const { mutate: unapproveParticipant } = useMutation<
      Participant,
      Error,
      {
        participantId: Participant["worth"];
        eventId: number;
      }
    >(
      ({ participantId, eventId }) => {
        openPopout(<ScreenSpinner />);
        return EventAPI.unapproveParticipant({
          participantId,
          eventId,
        });
      },
      {
        onSuccess: () => {
          closePopout();
          queryClient.refetchQueries(`event-${eventId}-${brigadeId}`);
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
        openPopout(<ScreenSpinner />);
        return EventAPI.removeParticipant({
          participantId,
          eventId,
        });
      },
      {
        onSuccess: () => {
          closePopout();
          queryClient.refetchQueries(`event-${eventId}-${brigadeId}`);
        },
        onError: closePopout,
      }
    );

    const onAddClick = () => {
      setModalCallback(MODAL_BOEC_LIST, (boec: Boec) => {
        mutate({
          boecId: boec.id,
          eventId,
          worth: 0,
          brigadeId: brigadeId!,
        });
      });
      openModal(MODAL_BOEC_LIST);
    };
    const platform = usePlatform();

    const handleOpenActionSheet = (data: Participant) => {
      openPopout(
        <ActionSheet
          onClose={closePopout}
          iosCloseItem={
            <ActionSheetItem autoclose mode="cancel">
              Отменить
            </ActionSheetItem>
          }
        >
          {activeTab === "notapproved" && (
            <ActionSheetItem
              autoclose
              onClick={() =>
                approveParticipant({
                  eventId: data.eventId,
                  participantId: data.id,
                })
              }
            >
              Подтвердить
            </ActionSheetItem>
          )}
          {activeTab === "approved" && (
            <ActionSheetItem
              autoclose
              onClick={() =>
                unapproveParticipant({
                  eventId: data.eventId,
                  participantId: data.id,
                })
              }
            >
              Снять подтверждение
            </ActionSheetItem>
          )}
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
    const ref = useRef<HTMLDivElement>(null);
    const showBrigadeSelectModal = useCallback(() => {
      // let count = user!.brigades.length;
      // if (count > 1) {
      //   openPopout(
      //     <ActionSheet
      //       onClose={closePopout}
      //       iosCloseItem={
      //         <ActionSheetItem autoclose mode="cancel">
      //           Отменить
      //         </ActionSheetItem>
      //       }
      //       toggleRef={ref.current!}
      //     >
      //       {user!.brigades.map(({ id, title }) => (
      //         <ActionSheetItem
      //           key={`${id}-${title}`}
      //           onClick={() => setBrigadeId(id)}
      //           autoclose
      //         >
      //           {title}
      //         </ActionSheetItem>
      //       ))}
      //     </ActionSheet>
      //   );
      // } else {
      //   user!.brigades.length > 0 && setBrigadeId(user!.brigades[0].id);
      // }
    }, []);
    useEffect(() => {
      showBrigadeSelectModal();
    }, [showBrigadeSelectModal]);

    useEffect(() => {
      let interval: NodeJS.Timeout;
      const check = () => {
        if (!popout && !brigadeId) {
          window.history.back();
        }
      };
      interval = setInterval(check, 350);

      return () => {
        clearInterval(interval);
      };
    }, [brigadeId, popout]);

    return (
      <Panel getRootRef={ref} {...props}>
        <PanelHeader
          left={<PanelHeaderBack onClick={() => window.history.back()} />}
        >
          <Title level="2" weight="bold">
            Заявки
          </Title>
        </PanelHeader>
        {!brigadeId ? (
          <PanelSpinner />
        ) : (
          <>
            <Group>
              <SimpleCell>
                <InfoRow header="Квота">1000</InfoRow>
              </SimpleCell>
              <SimpleCell onClick={onAddClick}>
                <InfoRow header="Доступно">1000</InfoRow>
              </SimpleCell>
            </Group>
            <Group>
              <Tabs mode="buttons">
                <TabsItem
                  onClick={() => setActiveTab("notapproved")}
                  selected={activeTab === "notapproved"}
                >
                  Не подтвержденные (15)
                </TabsItem>
                <TabsItem
                  onClick={() => setActiveTab("approved")}
                  selected={activeTab === "approved"}
                >
                  Подтвержденные (5)
                </TabsItem>
              </Tabs>
              <LazyList
                fetchFn={EventAPI.getEventParticipants}
                queryKey={`event-${eventId}-${brigadeId}`}
                extraFnProp={{
                  eventId,
                  worth: 0,
                  brigadeId: brigadeId!,
                  status: activeTab,
                }}
                enabled={!!eventId && !!brigadeId}
                renderItem={(item: Participant) => (
                  <SimpleCell
                    key={item.id}
                    onClick={() => handleOpenActionSheet(item)}
                  >
                    {item.boec.fullName}
                  </SimpleCell>
                )}
              />
            </Group>
          </>
        )}
      </Panel>
    );
  }
);
