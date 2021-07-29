import { debounce } from "@vkontakte/vkjs";
import { Footer, Header, Spinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { createContext, useCallback, useMemo } from "react";
import {
    InfiniteData,
    QueryObserverResult,
    useInfiniteQuery,
} from "react-query";
import { useIntersect } from "../../../features/utils/hooks/useIntersect";
import { ListResponse } from "../../../features/utils/types";

interface ListOptions {
    limit?: number;
    size?: number;
}

interface LazyUsersListProps<
    ItemType extends object,
    OptionsType extends ListOptions | undefined
> {
    renderItem: (item: ItemType) => JSX.Element | null;
    fetchFn: (options: OptionsType) => Promise<ListResponse<ItemType>>;
    extraFnProp?: Omit<OptionsType, "limit" | "offset">;
    queryKey: string;
    title?: string;
    enabled?: boolean;
    emptyMessage?: string;
}
const limit = 20;

export const LazyListContext = createContext({
    refetch: () =>
        undefined as unknown as Promise<
            QueryObserverResult<InfiniteData<ListResponse<any>>, Error>
        >,
});
export const LazyList = observer(
    <Dtype extends object, Otype extends ListOptions | undefined>({
        renderItem,
        fetchFn,
        queryKey,
        extraFnProp,
        title,
        enabled,
        emptyMessage = "Ничего не найдено",
    }: LazyUsersListProps<Dtype, Otype>) => {
        const queryFn = useCallback(
            ({ pageParam = 0, queryKey }) => {
                const data = fetchFn({
                    ...queryKey[1],
                    offset: pageParam,
                    limit,
                });
                return data;
            },
            [fetchFn]
        );

        const {
            data,
            fetchNextPage,
            isFetching,
            hasNextPage,
            isLoading,
            isError,
            refetch,
        } = useInfiniteQuery<ListResponse<any>, Error>({
            queryKey: [queryKey, extraFnProp],
            queryFn,
            refetchOnWindowFocus: false,
            getNextPageParam: (_lastPage, data) => {
                const hasMore =
                    data.reduce(
                        (result, page) => result + page.items.length,
                        0
                    ) < _lastPage.count;

                return hasMore && data.length * limit;
            },
            cacheTime: 0,
            enabled,
        });

        const flatData = useMemo(() => {
            return (data && data?.pages?.flatMap((page) => page.items)) || [];
        }, [data]);
        const fetch = useMemo(
            () => debounce(fetchNextPage, 500),
            [fetchNextPage]
        );

        const { setNode } = useIntersect(() => fetch());

        const LoadDetector = useMemo(() => {
            if (hasNextPage) {
                return <div className="h-4" ref={(el) => setNode(el!)}></div>;
            } else {
                return null;
            }
        }, [hasNextPage, setNode]);

        return (
            <LazyListContext.Provider
                value={{
                    refetch,
                }}
            >
                {title && (
                    <Header
                        mode="tertiary"
                        indicator={data && data.pages[0].count}
                    >
                        {title}
                    </Header>
                )}
                {flatData &&
                    flatData.length > 0 &&
                    flatData.map((item) => renderItem(item))}

                {isLoading && !isError && (
                    <Spinner size="small" style={{ margin: "20px 0" }} />
                )}
                {LoadDetector}
                {flatData &&
                    flatData.length === 0 &&
                    !isLoading &&
                    !isFetching &&
                    !isError && <Footer>{emptyMessage}</Footer>}
                {isError && <Footer>Ошибка соединения</Footer>}
            </LazyListContext.Provider>
        );
    }
);
