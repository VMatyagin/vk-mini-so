import { FC, useContext } from "react";
import {
    CellButton,
    Group,
    Panel,
    PanelHeaderBack,
    SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Competition, PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";

export const CompetitionsListPanel: FC<PanelProps> = observer(
    ({ id, viewId }) => {
        const { eventId } = useContext(eventStore);
        const { goBack, setPage } = useContext(routerStore);
        const { setCompetitionId } = useContext(eventStore);

        const changeView = (id: number) => {
            setCompetitionId(id);
            setPage(viewId, "competition-details");
        };

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
                            eventId,
                        }}
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
            </Panel>
        );
    }
);
