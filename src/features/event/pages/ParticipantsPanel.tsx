import { FC, useContext } from "react";
import {
    ActionSheet,
    ActionSheetItem,
    CellButton,
    Group,
    IOS,
    Panel,
    PanelHeaderBack,
    ScreenSpinner,
    SimpleCell,
    usePlatform,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Boec, PanelProps, Participant } from "../../types";
import { MODAL_BOEC_LIST } from "../../../ui/organisms/Modals";
import { eventStore } from "../store/eventStore";
import { LazyList } from "../../../ui/organisms/LazyList";
import { EventAPI } from "../../utils/requests/event-request";
import { useMutation, useQueryClient } from "react-query";
import {
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import { PARTICIPANT_TITLES } from "../helpers";

interface ParticipantsPanelProps extends PanelProps {
    worth: Participant["worth"];
}

export const ParticipantsPanel: FC<ParticipantsPanelProps> = observer(
    ({ id, viewId, worth }) => {
        const {
            goBack,
            setModalCallback,
            openModal,
            openPopout,
            closeModal,
            closePopout,
        } = useContext(routerStore);
        const { eventId } = useContext(eventStore);
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
                return EventAPI.setParticipant(data);
            },
            {
                onSuccess: () => {
                    closePopout();
                    queryClient.refetchQueries(`event-${id}`);
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
                    queryClient.refetchQueries(`event-${id}`);
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
                        {PARTICIPANT_TITLES[worth].title}
                    </Title>
                </PanelHeader>
                <Group>
                    <LazyList
                        title={PARTICIPANT_TITLES[worth].title}
                        fetchFn={EventAPI.getEventParticipants}
                        queryKey={`event-${id}`}
                        extraFnProp={{
                            eventId: eventId,
                            worth,
                        }}
                        renderItem={(item: Participant) => (
                            <SimpleCell
                                key={item.id}
                                onClick={() => handleOpenActionSheet(item)}
                            >
                                {item.boec.fullName}
                            </SimpleCell>
                        )}
                    />
                    <CellButton onClick={onAddClick}>Добавить</CellButton>
                </Group>
            </Panel>
        );
    }
);
