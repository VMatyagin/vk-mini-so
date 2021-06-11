import { FC, useContext, useState } from "react";
import {
    Footer,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    PanelSpinner,
    Search,
    SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { useQuery } from "react-query";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { brigadeStore } from "../store/brigadeStore";

export const ListPanel: FC<{ id: string }> = observer(({ id }) => {
    const { goBack, setPage } = useContext(routerStore);
    const { setBrigadeId } = useContext(brigadeStore);

    const { data, isLoading, isError } = useQuery({
        queryKey: [id],
        queryFn: () => BrigadesAPI.getAreas({}),
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const selectBrigade = (id: number) => {
        setBrigadeId(id);
        setPage("brigades", "details");
    };
    const [search, setSearch] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Отряды
                </Title>
            </PanelHeader>
            <Group>
                {!isLoading && (
                    <Search value={search} onChange={handleChange} />
                )}
                {isLoading && <PanelSpinner />}
                {!isLoading && !isError && data && data.count === 0 && (
                    <Footer>Ничего не найдено</Footer>
                )}
                {isError && <Footer>Произошла ошибка</Footer>}
            </Group>
            {data &&
                data.items
                    .sort((a, b) => b.brigades.length - a.brigades.length)
                    .map((area) => {
                        const areaBrigades = area.brigades.filter(
                            (brigade) =>
                                brigade.title
                                    .toLowerCase()
                                    .indexOf(search.toLowerCase()) > -1
                        );
                        if (areaBrigades.length === 0) {
                            return null;
                        }
                        return (
                            <Group
                                key={area.id}
                                header={
                                    <Header mode="secondary">
                                        {area.title}
                                    </Header>
                                }
                            >
                                {areaBrigades.map((brigade) => (
                                    <SimpleCell
                                        key={brigade.id}
                                        onClick={() =>
                                            selectBrigade(brigade.id)
                                        }
                                    >
                                        {brigade.title}
                                    </SimpleCell>
                                ))}
                            </Group>
                        );
                    })}
        </Panel>
    );
});
