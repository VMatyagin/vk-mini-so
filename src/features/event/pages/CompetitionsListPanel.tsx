import { FC, useContext, useMemo } from "react";
import {
    CellButton,
    Group,
    Panel,
    PanelHeaderBack,
    ScreenSpinner,
    SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Competition, PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";
import { appStore } from "../../stores/app-store";
import { useQuery } from "react-query";
import { canEditCompetitions } from "../helpers";

export const CompetitionsListPanel: FC<PanelProps> = observer(
    ({ id, viewId }) => {
        const { eventId, setCompetitionId } = useContext(eventStore);
        const { goBack, setPage, openPopout, closePopout } =
            useContext(routerStore);
        const { user } = useContext(appStore);

        const changeView = (id: number) => {
            setCompetitionId(id);
            setPage(viewId, "competition-details");
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
        const haveAccess = useMemo(
            () =>
                canEditCompetitions({
                    user: user!,
                    acceptedIds: [data?.shtabId!],
                }) || user?.isStaff,
            [data, user]
        );
        return (
            <Panel id={id}>
                <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                    <Title level="2" weight="bold">
                        Конкурсы
                    </Title>
                </PanelHeader>
                <Group>
                    <LazyList
                        title="Конкурсы"
                        fetchFn={EventAPI.getEventCompetitions}
                        queryKey={`competitions-list-${eventId}`}
                        extraFnProp={{
                            eventId: eventId!,
                        }}
                        enabled={!!eventId}
                        renderItem={(item: Competition) => (
                            <SimpleCell
                                key={item.id}
                                onClick={() => changeView(item.id)}
                            >
                                {item.title}
                            </SimpleCell>
                        )}
                    />
                </Group>
                {haveAccess && (
                    <Group>
                        <CellButton
                            onClick={() => {
                                setCompetitionId(null);
                                setPage(viewId, "competition-edit");
                            }}
                        >
                            Добавить конкурс
                        </CellButton>
                    </Group>
                )}
            </Panel>
        );
    }
);
