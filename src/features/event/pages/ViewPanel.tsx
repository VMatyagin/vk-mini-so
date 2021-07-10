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
import {
    Icon28FireOutline,
    Icon28Flash,
    Icon28UsersOutline,
} from "@vkontakte/icons";
import { useQuery } from "react-query";
import { PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";
import { EVENT_WORTH } from "../helpers";

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, openPopout, closePopout, setPage } =
        useContext(routerStore);
    const { eventId } = useContext(eventStore);

    const openPanel = (panel: string) => {
        setPage(viewId, panel);
    };

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
                        {data?.startTime?.slice(0, -3) || 'Не указано'}
                    </InfoRow>
                </SimpleCell>
                <CellButton onClick={() => openPanel("edit")}>
                    Редактировать
                </CellButton>
            </Group>
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
            </Group>
            <Group header={<Header mode="secondary">Конкурсная часть</Header>}>
                <SimpleCell
                    onClick={() => openPanel("competition-list")}
                    before={<Icon28Flash />}
                >
                    Конкурсы
                </SimpleCell>
            </Group>
        </Panel>
    );
});
