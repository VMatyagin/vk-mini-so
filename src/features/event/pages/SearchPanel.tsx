import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Search,
    Group,
    Panel,
    Header,
    Spinner,
    Footer,
} from "@vkontakte/vkui";

import { observer } from "mobx-react";

import debounce from "lodash.debounce";
import InfiniteScroll from "react-infinite-scroller";
import { useMst } from "../../stores";
import { ListResponse } from "../../utils/types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { EventCard } from "../../../ui/molecules/EventCard";
import { Event } from "../../types";

export const SearchPanel: FC<{ id: string }> = observer(({ id }) => {
    const store = useMst();

    const [data, setData] = useState<Event[]>();
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filter, setFilter] = useState({
        search: undefined as string | undefined,
        limit: 20,
        offset: 0,
        brigadeId: undefined as string | undefined,
    });

    const onLoad = useCallback((data: ListResponse<Event>) => {
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

    const { fetch, errors, isLoading } = useFetch(SoAPI.getEventList, onLoad);

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

    const changeView = (id: string) => {
        store.event.fetchEvent(id, () => {
            store.router.setPage("else_event_handle", "event_page");
        });
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    Поиск мероприятий
                </Title>
            </PanelHeader>
            <Group>
                <Search value={search} onChange={handleChange} />
                <Header mode="tertiary" indicator={totalCount}>
                    Мероприятия
                </Header>

                <InfiniteScroll
                    pageStart={0}
                    initialLoad={false}
                    loadMore={loadMoreD}
                    hasMore={!isLoading && data && data.length < totalCount}
                >
                    {data &&
                        data.map((item) => (
                            <EventCard
                                title={item.title}
                                startDate={item.startDate}
                                startTime={item.startTime}
                                description={item.description}
                                key={item.id}
                                onClick={() => changeView(item.id.toString())}
                            />
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
        </Panel>
    );
});
