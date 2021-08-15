import { FC, useContext, useMemo } from "react";
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
import {
    Icon28BillheadOutline,
    Icon28FireOutline,
    Icon28Flash,
    Icon28UsersOutline,
} from "@vkontakte/icons";
import { useMutation, useQuery } from "react-query";
import { PanelProps, Participant, User } from "../../types";
import { eventStore } from "../store/eventStore";
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
export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, openPopout, closePopout, setPage } =
        useContext(routerStore);
    const { eventId, selectBrigade } = useContext(eventStore);
    const { user } = useContext(appStore);

    const openPanel = (panel: string) => {
        setPage(viewId, panel);
    };

    const { data, refetch } = useQuery({
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
            openPopout(<ScreenSpinner />);
            return EventAPI.setParticipant(data);
        },
        {
            onSuccess: () => {
                closePopout();
                refetch();
            },
            onError: closePopout,
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

    const openBrigadeParticipant = (brigadeId: number) => {
        selectBrigade(brigadeId);
        openPanel("brigade-participant");
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
                    <Header mode="secondary">Информация о мероприятии</Header>
                }
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
                    <CellButton onClick={() => openPanel("edit")}>
                        Редактировать
                    </CellButton>
                )}
            </Group>

            {haveAccess && (
                <>
                    <Group header={<Header mode="secondary">Списки</Header>}>
                        <SimpleCell
                            before={<Icon28FireOutline />}
                            onClick={() => openPanel("organizers")}
                        >
                            Организаторы
                        </SimpleCell>
                        <SimpleCell
                            before={<Icon28UsersOutline />}
                            onClick={() => openPanel("volonteers")}
                        >
                            Волонтеры
                        </SimpleCell>
                        <SimpleCell
                            onClick={() => openPanel("participant")}
                            before={<Icon28UsersOutline />}
                        >
                            Участники
                        </SimpleCell>
                        <SimpleCell
                            onClick={() => openPanel("quotas")}
                            before={<Icon28BillheadOutline />}
                        >
                            Квоты
                        </SimpleCell>
                    </Group>
                </>
            )}
            {data && [1, 2].includes(data.worth) && (
                <Group
                    header={<Header mode="secondary">Конкурсная часть</Header>}
                >
                    <SimpleCell
                        onClick={() => openPanel("competition-list")}
                        before={<Icon28Flash />}
                    >
                        Конкурсы
                    </SimpleCell>
                </Group>
            )}
            <Group>
                {user!.brigades.length > 0 && (
                    <SubjectSelectingCell
                        onBrigadeClick={openBrigadeParticipant}
                        onlyBrigades={true}
                    >
                        {({ handleClick, ref }) => (
                            <SimpleCell
                                getRootRef={ref}
                                onClick={handleClick}
                                before={<Icon28UsersOutline />}
                            >
                                Заявки отряда
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
                                <CellButton
                                    getRootRef={ref}
                                    onClick={handleClick}
                                >
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
        </Panel>
    );
});
