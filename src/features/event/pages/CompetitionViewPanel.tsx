import { FC, useContext } from "react";
import {
    CellButton,
    Group,
    Header,
    InfoRow,
    Panel,
    PanelHeaderBack,
    ScreenSpinner,
    SimpleCell,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { Icon28Like, Icon28UsersOutline } from "@vkontakte/icons";
import { useMutation, useQuery } from "react-query";
import { Boec, Brigade, CompetitionParticipant, PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";
import { COMPETITIVE_PARTICIPANT_TITLES } from "../helpers";
import { MODAL_BOEC_SELECTING } from "../../boec/ui/modals/BoecSelectModal";
import { MODAL_BRIGADE_SELECTING } from "../../brigades/ui/modals/BrigadeSelectModal";
import { MODAL_EVENT_PARTICIPANT_TITLE } from "../ui/modals/ParticipantTitleModal";

export const CompetitionViewPanel: FC<PanelProps> = observer(
    ({ id, viewId }) => {
        const {
            goBack,
            openPopout,
            closePopout,
            setPage,
            openModal,
            setModalCallback,
        } = useContext(routerStore);
        const { competitionId } = useContext(eventStore);

        const openPanel = (panel: string) => {
            setPage(viewId, panel);
        };

        const { data, refetch } = useQuery({
            queryKey: ["competition", competitionId],
            queryFn: ({ queryKey }) => {
                openPopout(<ScreenSpinner />);
                return EventAPI.getCompetition(queryKey[1] as number);
            },
            retry: 1,
            refetchOnWindowFocus: false,
            onSuccess: closePopout,
            onError: closePopout,
            onSettled: closePopout,
        });
        const { mutate } = useMutation<
            CompetitionParticipant,
            Error,
            {
                boec: number[];
                brigadesIds: number[] | undefined;
                title: string;
            }
        >(
            ({ boec, brigadesIds, title }) => {
                openPopout(<ScreenSpinner />);

                return EventAPI.createCompetitionParticipant({
                    boec,
                    brigadesIds,
                    competitionId: competitionId!,
                    title,
                });
            },
            {
                onSuccess: () => {
                    closePopout();
                    refetch();
                },
            }
        );
        const brigadeSelectCallback = (data: {
            boec: number[];
            brigadesIds: number[] | undefined;
            title: string;
        }) => {
            mutate(data);
        };
        const boecSelectCallback = (boecList: Boec[], title: string) => {
            setModalCallback(MODAL_BRIGADE_SELECTING, (brigades: Brigade[]) =>
                brigadeSelectCallback({
                    boec: boecList.map((item) => item.id),
                    brigadesIds:
                        brigades.length > 0
                            ? brigades.map((item) => item.id)
                            : undefined,
                    title,
                })
            );
            openModal(MODAL_BRIGADE_SELECTING);
        };
        const createParticipant = () => {
            setModalCallback(MODAL_EVENT_PARTICIPANT_TITLE, (title: string) => {
                openModal(MODAL_BOEC_SELECTING);
                setModalCallback(MODAL_BOEC_SELECTING, (boecList: Boec[]) =>
                    boecSelectCallback(boecList, title)
                );
            });
            openModal(MODAL_EVENT_PARTICIPANT_TITLE);
        };
        return (
            <Panel id={id}>
                <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                    <Title level="2" weight="bold">
                        {data?.title}
                    </Title>
                </PanelHeader>
                <Group
                    header={
                        <Header mode="secondary">Информация о конкурсе</Header>
                    }
                >
                    <SimpleCell
                        onClick={() => openPanel("competition-participant-0")}
                    >
                        <InfoRow
                            header={COMPETITIVE_PARTICIPANT_TITLES[0].plural}
                        >
                            {data?.participant_count}
                        </InfoRow>
                    </SimpleCell>
                    <SimpleCell
                        onClick={() => openPanel("competition-participant-1")}
                    >
                        <InfoRow
                            header={COMPETITIVE_PARTICIPANT_TITLES[1].plural}
                        >
                            {data?.ivolvement_count}
                        </InfoRow>
                    </SimpleCell>
                    <SimpleCell
                        onClick={() => openPanel("competition-participant-2")}
                    >
                        <InfoRow
                            header={COMPETITIVE_PARTICIPANT_TITLES[2].plural}
                        >
                            {data?.winner_count}
                        </InfoRow>
                    </SimpleCell>
                    <SimpleCell
                        onClick={() => openPanel("competition-participant-3")}
                    >
                        <InfoRow
                            header={COMPETITIVE_PARTICIPANT_TITLES[3].plural}
                        >
                            {data?.notwinner_count}
                        </InfoRow>
                    </SimpleCell>
                    <CellButton onClick={() => openPanel("competition-edit")}>
                        Редактировать
                    </CellButton>
                </Group>
                <Group header={<Header mode="secondary">Заявки</Header>}>
                    <SimpleCell
                        before={<Icon28UsersOutline />}
                        onClick={createParticipant}
                    >
                        Создать заявку
                    </SimpleCell>
                </Group>
                <Group header={<Header mode="secondary">Номинации</Header>}>
                    <SimpleCell
                        before={<Icon28Like />}
                        onClick={() => openPanel("nominations-list")}
                    >
                        Редактировать номинации
                    </SimpleCell>
                </Group>
            </Panel>
        );
    }
);
