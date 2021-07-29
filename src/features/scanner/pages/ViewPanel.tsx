import { FC, useContext } from "react";
import { Group, Panel, SimpleCell, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { PanelProps } from "../../types";
import { LazyList } from "../../../ui/organisms/LazyList";
import { TicketsAPI } from "../../utils/requests/event-request";
import { routerStore } from "../../stores/router-store";

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { setPage } = useContext(routerStore);

    const goScan = () => {
        setPage(viewId, "scan");
    };

    return (
        <Panel id={id}>
            <PanelHeader>
                <Title level="2" weight="bold">
                    Сканер
                </Title>
            </PanelHeader>
            <Group>
                <SimpleCell onClick={goScan} expandable={true}>
                    Начать сканирование
                </SimpleCell>
            </Group>
            <Group>
                <LazyList
                    title="Последние отсканированные билеты"
                    fetchFn={TicketsAPI.getLastScans}
                    queryKey={"scans-list"}
                    emptyMessage={"Никто еще сканировал"}
                    renderItem={(item) => (
                        <SimpleCell key={item.id}>{item.ticket?.id}</SimpleCell>
                    )}
                />
            </Group>
        </Panel>
    );
});
