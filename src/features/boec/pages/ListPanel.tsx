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
import { boecStore } from "../store/boecStore";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Icon24Filter } from "@vkontakte/icons";
import { debounce } from "@vkontakte/vkjs";
import { PanelProps } from "../../types";
import { UsersAPI } from "../../utils/requests/user-request";
import { MODAL_BOEC_FILTER } from "../ui/modals/BoecFilterModal";

export const ListPanel: FC<PanelProps> = observer(({ id }) => {
    const { goBack, openModal, closeModal, setPage, setModalCallback } =
        useContext(routerStore);
    const { setBoecId } = useContext(boecStore);

    const changeView = (id: number) => {
        setBoecId(id);
        setPage("boec", "base");
    };

    const [search, setSearch] = useState<string>();
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,

        brigadeId: undefined as string | undefined,
    });

    const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
            setFilterD((prev) => ({
                search: event.target.value,

                brigadeId: prev.brigadeId,
            }));
        },
        [setFilterD]
    );

    const setFn = useCallback(
        (id?: string) => {
            setFilter((prev) => ({
                search: prev.search,

                brigadeId: id,
            }));
            closeModal();
        },
        [closeModal]
    );

    const onFilterClick = () => {
        setModalCallback(MODAL_BOEC_FILTER, setFn);
        openModal(MODAL_BOEC_FILTER);
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Люди
                </Title>
            </PanelHeader>
            <Group>
                <Search
                    value={search}
                    onChange={handleChange}
                    icon={<Icon24Filter />}
                    onIconClick={onFilterClick}
                />
                <LazyList
                    title="Бойцы"
                    fetchFn={UsersAPI.getList}
                    queryKey={"boec-list"}
                    extraFnProp={{
                        search: filter.search,
                        brigadeId: filter.brigadeId,
                    }}
                    renderItem={(item) => (
                        <SimpleCell
                            key={item.id}
                            onClick={() => changeView(item.id)}
                        >
                            {item.fullName}
                        </SimpleCell>
                    )}
                />
            </Group>
        </Panel>
    );
});
