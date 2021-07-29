import { FC, useContext, useMemo } from "react";
import {
    ActionSheet,
    ActionSheetItem,
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
import { LazyList } from "../../../ui/organisms/LazyList";
import { CompetitionParticipant, PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";
import {
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid,
    Icon28DoneOutline,
    Icon28HistoryBackwardOutline,
} from "@vkontakte/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    canEditCompetitions,
    COMPETITIVE_PARTICIPANT_TITLES,
} from "../helpers";
import { MODAL_EVENT_NOMINATION_SELECT } from "../ui/modals/NominationSelectModal";
import { appStore } from "../../stores/app-store";

interface CompetitionParticipantListPanelProps extends PanelProps {
    worth: CompetitionParticipant["worth"];
}
export const CompetitionParticipantListPanel: FC<CompetitionParticipantListPanelProps> =
    observer(({ id, worth }) => {
        const { goBack, openPopout, closePopout, openModal, setModalCallback } =
            useContext(routerStore);
        const queryClient = useQueryClient();
        const { competitionId, eventId } = useContext(eventStore);
        const { user } = useContext(appStore);
        const platform = usePlatform();
        const { data } = useQuery({
            queryKey: ["event", eventId],
            queryFn: ({ queryKey }) => {
                openPopout(<ScreenSpinner />);
                return EventAPI.getEvent(queryKey[1] as number);
            },
            retry: 1,
            refetchOnWindowFocus: false,
            onSuccess: closePopout,
        });
        const haveAccess = useMemo(
            () =>
                canEditCompetitions({
                    user: user!,
                    acceptedIds: [data?.shtabId!],
                }) || user?.isStaff,
            [data, user]
        );
        const { mutate: removeParticipant } = useMutation<
            CompetitionParticipant,
            Error,
            {
                participantId: number;
                competitionId: number;
            }
        >(
            ({ participantId, competitionId }) => {
                closePopout();
                openPopout(<ScreenSpinner />);
                return EventAPI.removeCompetitionParticipant({
                    participantId,
                    competitionId,
                });
            },
            {
                onSuccess: () => {
                    closePopout();
                    queryClient.refetchQueries(
                        `competitions-participant-list-${competitionId}-${worth}`
                    );
                },
                onError: closePopout,
            }
        );
        const { mutate: updateParticipant } = useMutation<
            CompetitionParticipant,
            Error,
            {
                participantId: number;
                competitionId: number;
                participant: Partial<CompetitionParticipant>;
            }
        >(
            ({ participantId, competitionId, participant }) => {
                closePopout();
                openPopout(<ScreenSpinner />);
                return EventAPI.updateCompetitionParticipant({
                    participantId,
                    competitionId,
                    participant,
                });
            },
            {
                onSuccess: () => {
                    closePopout();
                    queryClient.refetchQueries(
                        `competitions-participant-list-${competitionId}-${worth}`
                    );
                },
                onError: closePopout,
            }
        );

        const setBigWorth = (participant: CompetitionParticipant) => {
            setModalCallback(
                MODAL_EVENT_NOMINATION_SELECT,
                (nominationId: number) => {
                    updateParticipant({
                        participantId: participant.id,
                        competitionId: competitionId!,
                        participant: {
                            worth: 1,
                            nominationId,
                        },
                    });
                }
            );
            openModal(MODAL_EVENT_NOMINATION_SELECT);
        };
        const handleOpenActionSheet = (participant: CompetitionParticipant) => {
            openPopout(
                <ActionSheet
                    onClose={closePopout}
                    iosCloseItem={
                        <ActionSheetItem autoclose mode="cancel">
                            Отменить
                        </ActionSheetItem>
                    }
                >
                    {worth === 0 && (
                        <ActionSheetItem
                            autoclose
                            before={<Icon28DoneOutline />}
                            onClick={() =>
                                updateParticipant({
                                    participantId: participant.id,
                                    competitionId: competitionId!,
                                    participant: {
                                        worth: 1,
                                    },
                                })
                            }
                        >
                            Заявка прошла
                        </ActionSheetItem>
                    )}
                    {worth === 1 && (
                        <ActionSheetItem
                            autoclose
                            before={<Icon28DoneOutline />}
                            onClick={() => setBigWorth(participant)}
                        >
                            Выбор номинации
                        </ActionSheetItem>
                    )}
                    {worth !== 0 && (
                        <ActionSheetItem
                            autoclose
                            before={<Icon28HistoryBackwardOutline />}
                            onClick={() =>
                                updateParticipant({
                                    participantId: participant.id,
                                    competitionId: competitionId!,
                                    participant: {
                                        worth: (participant.worth === 1
                                            ? 0
                                            : 1) as CompetitionParticipant["worth"],
                                    },
                                })
                            }
                        >
                            Откатить назад
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
                                participantId: participant.id,
                                competitionId: competitionId!,
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
                    <LazyList
                        title={COMPETITIVE_PARTICIPANT_TITLES[worth].title}
                        fetchFn={EventAPI.getCompetitionParicipants}
                        queryKey={`competitions-participant-list-${competitionId}-${worth}`}
                        extraFnProp={{
                            competitionId,
                            worth,
                        }}
                        renderItem={(item: CompetitionParticipant) => (
                            <SimpleCell
                                key={item.id}
                                disabled={!haveAccess}
                                onClick={() => handleOpenActionSheet(item)}
                                description={item.nomination.reduce(
                                    (prev, current, index) => {
                                        const delimiter =
                                            index === 0 ? "" : "|";
                                        return `${prev} ${delimiter} ${current.title}`;
                                    },
                                    ""
                                )}
                            >
                                {item.brigades.reduce(
                                    (prev, current, index) => {
                                        const delimiter =
                                            index === 0 ? "" : "|";
                                        return `${prev} ${delimiter} ${current.title}`;
                                    },
                                    `${item.title ? `${item.title} | ` : ""} `
                                )}
                            </SimpleCell>
                        )}
                    />
                </Group>
            </Panel>
        );
    });
