import { FC, useCallback, useContext, useMemo, useState } from "react";
import {
    Group,
    Panel,
    PanelHeaderBack,
    Search,
    SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { LazyList } from "../../../ui/organisms/LazyList";
import { debounce } from "@vkontakte/vkjs";
import { EventType, PanelProps } from "../../types";
import { eventStore } from "../store/eventStore";
import { EventAPI } from "../../utils/requests/event-request";
import { appStore } from "../../stores/app-store";

const getDescription = ({
    date,
    place,
}: {
    date?: string | null;
    place?: string | null;
}) => {
    let description = "";
    if (date) {
        description += new Date(date).toLocaleString("ru", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
    }

    if (place) {
        description += `| ${place}`;
    }

    return description;
};

export const ListPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack, setPage } = useContext(routerStore);
    const { setEventId } = useContext(eventStore);
    const { user } = useContext(appStore);

    const changeView = (id: number) => {
        setEventId(id);
        setPage(viewId, "details");
    };

    const [search, setSearch] = useState<string>();
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,
    });

    const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
            setFilterD({
                search: event.target.value,
            });
        },
        [setFilterD]
    );

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Мероприятия
                </Title>
            </PanelHeader>
            <Group>
                <Search value={search} onChange={handleChange} />
                <LazyList
                    title="Мероприятия"
                    fetchFn={EventAPI.getEventList}
                    queryKey={"event-list"}
                    extraFnProp={{
                        search: filter.search,
                        visibility: !(user!.shtabs.length > 0 || user?.isStaff)
                            ? true
                            : undefined,
                    }}
                    renderItem={(item: EventType) => (
                        <SimpleCell
                            key={item.id}
                            onClick={() => changeView(item.id)}
                            description={getDescription({
                                date: item.startDate,
                                place: item.location,
                            })}
                        >
                            {`${item.title} | ${
                                item.shtab?.title || "Без организатора"
                            }`}
                        </SimpleCell>
                    )}
                />
            </Group>
        </Panel>
    );
});
