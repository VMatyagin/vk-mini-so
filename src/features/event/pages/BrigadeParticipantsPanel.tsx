import { FC, useContext, useState } from "react";
import {
    ActionSheet,
    ActionSheetItem,
    Group,
    InfoRow,
    IOS,
    Panel,
    PanelHeaderBack,
    ScreenSpinner,
    SimpleCell,
    Tabs,
    TabsItem,
    usePlatform,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Boec, PanelProps, Participant } from "../../types";
import { eventStore } from "../store/eventStore";
import { LazyList } from "../../../ui/organisms/LazyList";
import { EventAPI } from "../../utils/requests/event-request";
import { useMutation, useQueryClient } from "react-query";
import {
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import { MODAL_BOEC_LIST } from "../../boec/ui/modals/BoecListModal";

export const BrigadeParticipantsPanel: FC<PanelProps> = observer(
    ({ id, viewId }) => {
        const {
            goBack,
            setModalCallback,
            openModal,
            openPopout,
            closeModal,
            closePopout,
        } = useContext(routerStore);
        const { eventId, brigadeId } = useContext(eventStore);
        const queryClient = useQueryClient();

        const [activeTab, setActiveTab] = useState<"notapproved" | "approved">(
            "notapproved"
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
                closeModal();
                openPopout(<ScreenSpinner />);
                return EventAPI.setParticipant(data);
            },
            {
                onSuccess: () => {
                    closePopout();
                    queryClient.refetchQueries(`event-${id}-${brigadeId}`);
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
                    queryClient.refetchQueries(`event-${id}-${brigadeId}`);
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
                    queryClient.refetchQueries(`event-${id}-${brigadeId}`);
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
                    queryClient.refetchQueries(`event-${id}-${brigadeId}`);
                },
                onError: closePopout,
            }
        );

        const onAddClick = () => {
            setModalCallback(MODAL_BOEC_LIST, (boec: Boec) => {
                mutate({
                    boecId: boec.id,
                    eventId: eventId!,
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
        return (
            <Panel id={id}>
                <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                    <Title level="2" weight="bold">
                        Заявки
                    </Title>
                </PanelHeader>
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
                        queryKey={`event-${id}-${brigadeId}`}
                        extraFnProp={{
                            eventId: eventId!,
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
            </Panel>
        );
    }
);
