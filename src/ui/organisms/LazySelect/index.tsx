import { debounce } from "@vkontakte/vkjs";
import { CustomSelectOption, Footer, Select, Spinner } from "@vkontakte/vkui";
import React, { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import { useIntersect } from "../../../features/utils/hooks/useIntersect";
import { ListResponse } from "../../../features/utils/types";

interface ListOptions {
    limit?: number;
    size?: number;
}

interface LazySelectProps<
    ItemType extends object,
    OptionsType extends ListOptions | undefined
> {
    parseItem: (item: ItemType) => {
        value: string | number;
        label: string;
    };
    fetchFn: (options: OptionsType) => Promise<ListResponse<ItemType>>;
    extraFnProp?: Omit<OptionsType, "limit" | "offset">;
    queryKey: string;
    name: string;
    value: number | null | undefined;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    enabled?: boolean;
}
const limit = 20;

export const LazySelect = <
    Dtype extends object,
    Otype extends ListOptions | undefined
>({
    fetchFn,
    queryKey,
    extraFnProp,
    name,
    value,
    onChange,
    parseItem,
    enabled,
}: LazySelectProps<Dtype, Otype>) => {
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
        hasNextPage = true,
        isLoading,
        isError,
    } = useInfiniteQuery<ListResponse<any>, Error>({
        queryKey: [queryKey, extraFnProp],
        queryFn,
        refetchOnWindowFocus: false,
        getNextPageParam: (_lastPage, data) => {
            const hasMore =
                data.reduce((result, page) => result + page.items.length, 0) <
                _lastPage.count;

            return hasMore && data.length * limit;
        },
        cacheTime: 0,
        enabled,
    });

    const flatData = useMemo(() => {
        return (data && data?.pages?.flatMap((page) => page.items)) || [];
    }, [data]);
    const fetch = useMemo(() => debounce(fetchNextPage, 500), [fetchNextPage]);
    const { setNode } = useIntersect(() => fetch());

    const options = useMemo(() => {
        let newOptions = flatData.map(parseItem) as {
            value: any;
            label: string;
            [field: string]: any;
        }[];
        if (hasNextPage || (isLoading && !isError)) {
            newOptions = [
                ...newOptions,
                { value: Math.random(), label: "", isSpinner: true },
            ];
        }
        if (hasNextPage) {
            newOptions = [
                ...newOptions,
                { value: Math.random(), label: "", isLoadDetector: true },
            ];
        }

        if (
            flatData &&
            flatData.length === 0 &&
            !isLoading &&
            !isFetching &&
            !isError
        ) {
            newOptions = [
                ...newOptions,
                { value: Math.random(), label: "", isEmpty: true },
            ];
        }
        if (isError) {
            newOptions = [
                ...newOptions,
                { value: Math.random(), label: "", isError: true },
            ];
        }

        return newOptions;
    }, [flatData, hasNextPage, isError, isFetching, isLoading, parseItem]);

    return (
        <Select
            name={name}
            defaultValue={value || undefined}
            placeholder="Не выбран"
            options={options}
            onChange={onChange}
            renderOption={({ option, ...restProps }) => {
                if (option.isLoadDetector) {
                    return (
                        <div
                            style={{ height: 4 }}
                            ref={(el) => setNode(el!)}
                        ></div>
                    );
                }
                if (option.isSpinner) {
                    return (
                        <Spinner size="small" style={{ margin: "10px 0" }} />
                    );
                }
                if (option.isEmpty) {
                    return <Footer>Ничего не найдено</Footer>;
                }
                if (option.isError) {
                    return <Footer>Ошибка соединения</Footer>;
                }
                return <CustomSelectOption {...restProps} />;
            }}
        />
    );
};
