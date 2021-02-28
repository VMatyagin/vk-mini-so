import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { PanelTemplate } from "../../../ui/panels/template/PanelTemplate";
import {
    Footer,
    Group,
    Header,
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

export const UsersPanelBase: FC<{ id: string }> = ({ id }) => {
    const [data, setData] = useState<Boec[]>();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,
        limit: 20,
        offset: 0,
    });

    const onLoad = useCallback((data: ListResponse<Boec>) => {
        setTotalCount((prev) => {
            if (data.count === prev) {
                setData((prev) => [...(prev ? prev : []), ...data.items]);
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
        console.log("has");

        setFilter((prev) => ({
            search: prev.search,
            limit: 20,
            offset: prev.offset + prev.limit,
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
            setFilterD({
                search: event.target.value,
                limit: 20,
                offset: 0,
            });
        },
        [setFilterD]
    );

    return (
        <PanelTemplate id={id}>
            <PanelHeader>
                <Title level="2" weight="bold">
                    Люди
                </Title>
            </PanelHeader>
            <Group>
                <Search
                    value={search}
                    onChange={handleChange}
                    // onIconClick={onFiltersClick}
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
                            >{`${item.lastName} ${item.firstName} ${item.middleName}`}</SimpleCell>
                        ))}

                    {isLoading && (
                        <Spinner size="small" style={{ margin: "20px 0" }} />
                    )}
                </InfiniteScroll>
                {!isLoading && data && data.length === 0 && (
                    <Footer>Ничего не найдено</Footer>
                )}
                {errors && <Footer>Ошибка соединения</Footer>}
            </Group>
        </PanelTemplate>
    );
};
