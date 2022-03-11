import {
  CustomSelect,
  CustomSelectOption,
  CustomSelectOptionInterface,
  Spinner,
} from "@vkontakte/vkui";
import React, { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDebounce } from "use-debounce";
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
  parseItem: (item: ItemType) => CustomSelectOptionInterface;
  fetchFn: (options: OptionsType) => Promise<ListResponse<ItemType>>;
  extraFnProp?: Omit<OptionsType, "limit" | "offset">;
  queryKey: string;
  name: string;
  value?: CustomSelectOptionInterface;
  onChange: (option: CustomSelectOptionInterface) => void;
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
  parseItem,
  enabled,
  onChange,
  value,
  name,
}: LazySelectProps<Dtype, Otype>) => {
  const [searchInput, setSearch] = useState<string>("");
  const [search] = useDebounce(searchInput, 750);

  const queryFn = useCallback(
    ({ pageParam = 0, queryKey }) => {
      const data = fetchFn({
        search: queryKey[1],
        ...queryKey[2],
        offset: pageParam,
        limit,
      });
      return data;
    },
    [fetchFn]
  );
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    ListResponse<any>,
    Error
  >({
    queryKey: [queryKey, search, extraFnProp],
    queryFn,
    refetchOnWindowFocus: false,
    getNextPageParam: (_lastPage, data) => {
      const hasMore =
        data.reduce((result, page) => result + page.items.length, 0) <
        _lastPage.count;
      return hasMore ? data.length * limit : undefined;
    },
    enabled,
  });

  const flatData = useMemo(() => {
    return (data && data?.pages?.flatMap((page) => page.items)) || [];
  }, [data]);

  const { setNode } = useIntersect(() => fetchNextPage());

  const options = useMemo(() => {
    let newOptions = flatData.map(parseItem) as CustomSelectOptionInterface[];

    if (value && searchInput === "") {
      return [
        value,
        ...newOptions.filter((option) => option.value !== value?.value),
      ];
    }

    return newOptions;
  }, [flatData, parseItem, searchInput, value]);
  const LoadDetector = useMemo(() => {
    if (hasNextPage && !isFetching) {
      return <div className="h-4" ref={(el) => setNode(el!)}></div>;
    } else {
      return null;
    }
  }, [hasNextPage, setNode, isFetching]);
  return (
    <CustomSelect
      placeholder="Не выбран"
      // на устройствах не дает выбрать опцию
      // searchable={true}
      name={name}
      value={value?.value}
      onChange={(event) => {
        const option = options.find(
          (option) => String(option.value) === event.target.value
        );

        onChange(option!);
      }}
      onInputChange={(event) => {
        const remoteQuery = (
          event as unknown as React.ChangeEvent<HTMLInputElement>
        ).target.value as unknown as string;
        setSearch(remoteQuery);
      }}
      onClose={() => {
        setSearch("");
      }}
      filterFn={false}
      options={options}
      renderOption={({ option, ...restProps }) => (
        <CustomSelectOption {...restProps} description={option.description} />
      )}
      renderDropdown={({ defaultDropdownContent }) => {
        return (
          <>
            {defaultDropdownContent}
            {LoadDetector}
            {(hasNextPage || !data) && (
              <CustomSelectOption>
                <Spinner />
              </CustomSelectOption>
            )}
          </>
        );
      }}
    />
  );
};
