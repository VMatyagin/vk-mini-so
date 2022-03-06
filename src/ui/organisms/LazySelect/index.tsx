import {
  CustomSelect,
  CustomSelectOption,
  CustomSelectOptionInterface,
} from "@vkontakte/vkui";
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
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
    ({ queryKey }) => {
      const data = fetchFn({
        search: queryKey[1],
        ...queryKey[2],
      });
      return data;
    },
    [fetchFn]
  );

  const { data, isFetching } = useQuery<ListResponse<any>, Error>({
    queryKey: [queryKey, search, extraFnProp],
    queryFn,
    refetchOnWindowFocus: false,
    enabled,
  });

  const flatData = useMemo(() => {
    return data?.items ?? [];
  }, [data]);

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
      fetching={isFetching || searchInput !== search}
      renderOption={({ option, ...restProps }) => (
        <CustomSelectOption
          // {...restProps}
          children={restProps.children}
          onClick={() => alert(2)}
          description={option.description}
        />
      )}
    />
  );
};
