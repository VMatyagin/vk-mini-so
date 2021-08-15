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
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { brigadeStore } from "../store/brigadeStore";
import { LazyList } from "../../../ui/organisms/LazyList";
import { debounce } from "@vkontakte/vkjs";

export const ListPanel: FC<{ id: string }> = observer(({ id }) => {
    const { goBack, setPage } = useContext(routerStore);
    const { setBrigadeId } = useContext(brigadeStore);
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,
    });
    const selectBrigade = (id: number) => {
        setBrigadeId(id);
        setPage("brigades", "details");
    };
    const [search, setSearch] = useState<string>();

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
                    Отряды
                </Title>
            </PanelHeader>
            <Group>
                <Search value={search} onChange={handleChange} />

                <LazyList
                    fetchFn={BrigadesAPI.getBrigadesList}
                    queryKey={"brigade-list-sort"}
                    extraFnProp={{
                        search: filter.search,
                    }}
                    renderItem={(brigade) => (
                        <SimpleCell
                            key={brigade.id}
                            onClick={() => selectBrigade(brigade.id)}
                        >
                            {brigade.title}
                        </SimpleCell>
                    )}
                />
            </Group>
        </Panel>
    );
});
