import {
    Footer,
    Group,
    Header,
    List,
    PullToRefresh,
    Search,
    Spinner
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import React, {
    createContext,
    useCallback,
    useMemo,
    useState,
    useImperativeHandle
} from "react";
import { useInfiniteQuery } from "react-query";
import { useIntersect } from "../../../features/utils/hooks/useIntersect";
import { ListResponse } from "../../../features/utils/types";
import { useDebounce } from "use-debounce";

interface ListOptions {
    limit?: number;
    size?: number;
}
export interface LazyListControls {
    refetch: VoidFunction;
}

interface LazyUsersListProps<
    ItemType extends object,
    OptionsType extends ListOptions | undefined
> {
    renderItem?: (item: ItemType) => JSX.Element | null;
    fetchFn: (options: OptionsType) => Promise<ListResponse<ItemType>>;
    extraFnProp?: Omit<OptionsType, "limit" | "offset">;
    queryKey: string;
    title?: string;
    enabled?: boolean;
    emptyMessage?: string;
    customRender?: (array: ItemType[]) => React.ReactNode;
    withSearch?: boolean;
    laztListRef?: React.RefObject<LazyListControls>;
    pullToRefresh?: boolean;
    onRefetch?: () => Promise<void>;
    before?: React.ReactNode;
}
const limit = 20;

interface LazyListContextProps {
    refetch: VoidFunction;
}
export const LazyListContext = createContext<LazyListContextProps>({
    refetch: () => undefined
});
export const LazyList = observer(
    <Dtype extends object, Otype extends ListOptions | undefined>({
        renderItem,
        fetchFn,
        queryKey,
        extraFnProp,
        title,
        customRender,
        enabled,
        emptyMessage = "Ничего не найдено",
        withSearch = false,
        laztListRef,
        pullToRefresh,
        before,
        onRefetch
    }: LazyUsersListProps<Dtype, Otype>) => {
        const queryFn = useCallback(
            ({ pageParam = 0, queryKey }) => {
                const data = fetchFn({
                    search: queryKey[1],
                    ...queryKey[2],
                    offset: pageParam,
                    limit
                });
                return data;
            },
            [fetchFn]
        );
        const [searchInput, setSearch] = useState<string>("");
        const [search] = useDebounce(searchInput, 750);
        const {
            data,
            fetchNextPage,
            isFetching,
            hasNextPage,
            isLoading,
            isError,
            refetch: refetchQuery
        } = useInfiniteQuery<ListResponse<any>, Error>({
            queryKey: [queryKey, search, extraFnProp],
            queryFn,
            refetchOnWindowFocus: false,
            getNextPageParam: (_lastPage, data) => {
                const hasMore =
                    data.reduce(
                        (result, page) => result + page.items.length,
                        0
                    ) < _lastPage.count;
                return hasMore ? data.length * limit : undefined;
            },
            cacheTime: 0,
            enabled
        });
        const refetch = useCallback(async () => {
            await Promise.all([onRefetch?.(), refetchQuery()]);
        }, [onRefetch, refetchQuery]);

        const flatData = useMemo(() => {
            return (data && data?.pages?.flatMap(page => page.items)) || [];
        }, [data]);

        const { setNode } = useIntersect(() => fetchNextPage());

        const LoadDetector = useMemo(() => {
            if (hasNextPage && !isFetching) {
                return <div className="h-4" ref={el => setNode(el!)}></div>;
            } else {
                return null;
            }
        }, [hasNextPage, setNode, isFetching]);
        const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        };
        useImperativeHandle(laztListRef, () => ({
            refetch
        }));

        const Component = (
            <LazyListContext.Provider
                value={{
                    refetch
                }}
            >
                {withSearch && (
                    <Search value={searchInput} onChange={onSearchChange} />
                )}
                {title && (
                    <Header mode="tertiary" indicator={data?.pages[0].count}>
                        {title}
                    </Header>
                )}
                {!((isLoading || search !== searchInput) && !isError) && (
                    <List>
                        {!customRender &&
                            renderItem &&
                            flatData?.map(item => renderItem(item))}
                        {customRender &&
                            flatData?.length > 0 &&
                            customRender(flatData)}
                        {LoadDetector}
                    </List>
                )}
                {(hasNextPage || !data) && (
                    <Spinner size="small" style={{ margin: "20px 0" }} />
                )}
                {flatData.length === 0 &&
                    !(isLoading || search !== searchInput) &&
                    !isFetching &&
                    !isError && <Footer>{emptyMessage}</Footer>}
                {isError && <Footer>Ошибка соединения</Footer>}
            </LazyListContext.Provider>
        );

        return (
            <Group>
                {before}
                {pullToRefresh ? (
                    <PullToRefresh onRefresh={refetch} isFetching={isLoading}>
                        {Component}
                    </PullToRefresh>
                ) : (
                    Component
                )}
            </Group>
        );
    }
);
