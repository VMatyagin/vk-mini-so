import { debounce } from "@vkontakte/vkjs";
import { Footer, Header, Spinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import { useIntersect } from "../../../features/utils/hooks/useIntersect";
import { ListResponse } from "../../../features/utils/types";

interface LazyUsersListProps {
    renderItem: (item: any) => JSX.Element | null;
    fetchFn: (options: any) => Promise<ListResponse<Record<string, any>>>;
    extraFnProp?: Record<string, unknown>;
    queryKey: string;
    title?: string;
}
const limit = 20;

export const LazyList: FC<LazyUsersListProps> = observer(
    ({ renderItem, fetchFn, queryKey, extraFnProp, title }) => {
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
            <>
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
                    !isFetching && !isError && <Footer>Ничего не найдено</Footer>}
                {isError && <Footer>Ошибка соединения</Footer>}
            </>
        );
    }
);
