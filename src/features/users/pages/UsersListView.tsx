import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
    Footer,
    Group,
    Header,
    ModalRoot,
    Panel,
    Search,
    SimpleCell,
    Spinner,
} from "@vkontakte/vkui";
import InfiniteScroll from "react-infinite-scroller";
import debounce from "lodash.debounce";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { SoAPI } from "../../utils/api.service";
import { useFetch } from "../../utils/useFetch";
import { ListResponse } from "../../utils/types";
import { Boec } from "../../types";
import { useMst } from "../../stores";
import { Icon24Filter } from "@vkontakte/icons";
import { UsersFilterModal } from "../molecules/modals/UsersFilterModal";
import { observer } from "mobx-react";
import { AbstractView } from "../../../ui/molecules/AbstractView";

export const UsersListView: FC<{ id: string }> = observer(({ id }) => {
    const store = useMst();

    const [data, setData] = useState<Boec<true>[]>();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,
        limit: 20,
        offset: 0,
        brigadeId: undefined as string | undefined,
    });

    const onLoad = useCallback((data: ListResponse<Boec<true>>) => {
        setTotalCount((prev) => {
            if (data.count === prev) {
                setData((prev) => [
                    ...(prev ? prev : []),
                    ...data.items.filter(
                        (item) =>
                            !prev
                                ?.map((prevItem) => prevItem.id)
                                .includes(item.id)
                    ),
                ]);
            } else {
                setData(data.items);
            }

            return data.count;
        });
    }, []);

    const { fetch, errors, isLoading } = useFetch(SoAPI.getList, onLoad);

    useEffect(() => {
        fetch(filter);
    }, [fetch, filter]);

    const [search, setSearch] = useState<string>();

    const loadMore = useCallback(() => {
        setFilter((prev) => ({
            search: prev.search,
            limit: 20,
            offset: prev.offset + prev.limit,
            brigadeId: prev.brigadeId,
        }));
    }, []);
    const loadMoreD = useMemo(
        () => debounce(loadMore || (() => undefined), 750),
        [loadMore]
    );
    const setFilterD = useMemo(
        () => debounce(setFilter || (() => undefined), 750),
        [setFilter]
    );
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
            setFilterD((prev) => ({
                search: event.target.value,
                limit: 20,
                offset: 0,
                brigadeId: prev.brigadeId,
            }));
        },
        [setFilterD]
    );

    const onFilterClick = () => {
        store.router.openModal("MODAL_USERS_LIST");
    };
    let activeModal =
        store.router.activeModals[id] === undefined
            ? null
            : store.router.activeModals[id];

    const modals = (
        <ModalRoot activeModal={activeModal}>
            <UsersFilterModal
                id="MODAL_USERS_LIST"
                onClose={(id?: string) => {
                    setFilter((prev) => ({
                        search: prev.search,
                        limit: 20,
                        offset: 0,
                        brigadeId: id,
                    }));
                    store.router.closeModal();
                }}
            />
        </ModalRoot>
    );

    const changeView = (id: string) => {
        store.router.setPage("user", "base");
        store.boec.fetchBoec(id);
    };

    return (
        <AbstractView id={id} modal={modals}>
            <Panel id="base">
                <PanelHeader>
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
                    <Header mode="tertiary" indicator={totalCount}>
                        Люди
                    </Header>

                    <InfiniteScroll
                        pageStart={0}
                        initialLoad={false}
                        loadMore={loadMoreD}
                        hasMore={!isLoading && data && data.length < totalCount}
                    >
                        {data &&
                            data.map((item) => (
                                <SimpleCell
                                    key={item.id}
                                    onClick={() =>
                                        changeView(item.id.toString())
                                    }
                                >
                                    {item.fullName}
                                </SimpleCell>
                            ))}

                        {isLoading && (
                            <Spinner
                                size="small"
                                style={{ margin: "20px 0" }}
                            />
                        )}
                    </InfiniteScroll>
                    {!isLoading && data && data.length === 0 && (
                        <Footer>Ничего не найдено</Footer>
                    )}
                    {errors && <Footer>Ошибка соединения</Footer>}
                </Group>
            </Panel>
        </AbstractView>
    );
});
