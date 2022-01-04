import { FC, useCallback, useMemo, useState } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  Search,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { debounce } from "@vkontakte/vkjs";

// const sortByFirstSeason = (seasons: Season[]) => {
//     let usedUsers = new Set();
//     return Object.entries(
//         seasons
//             .sort((a, b) => a.year - b.year)
//             .reduce((prev, current) => {
//                 if (usedUsers.has(toJS(current.boec.id))) {
//                     return prev;
//                 }
//                 usedUsers.add(toJS(current.boec.id));

//                 return {
//                     ...prev,
//                     [current.year]: [
//                         ...(prev[current.year] || []),
//                         current.boec,
//                     ],
//                 };
//             }, {} as Record<string, Boec[]>)
//     );
// };

// const sortByYear = (seasons: Season[]) => {
//     return Object.entries(
//         seasons
//             .sort((a, b) => a.year - b.year)
//             .reduce(
//                 (prev, current) => ({
//                     ...prev,
//                     [current.year]: [
//                         ...(prev[current.year] || []),
//                         current.boec,
//                     ],
//                 }),
//                 {} as Record<string, Boec[]>
//             )
//     );
// };

export const BrigadeBoecListPanel: FC<PanelProps> = observer((props) => {
  // const { route } = useRoute();
  // const { brigadeId } = useMemo(() => route.params, [route]);
  // const { data: seasons } = useQuery({
  //     queryKey: ["seasons", brigadeId],
  //     queryFn: ({ queryKey }) => {
  //         openPopout(<ScreenSpinner />);
  //         return BrigadesAPI.getBrigadeSeasons({
  //             brigadeId: queryKey[1] as number,
  //         });
  //     },
  //     retry: 1,
  //     refetchOnWindowFocus: false,
  //     enabled: !!brigadeId,
  //     onSuccess: closePopout,
  // });

  // const { data: brigade } = useQuery({
  //     queryKey: ["brigade", brigadeId],
  //     queryFn: ({ queryKey }) => {
  //         openPopout(<ScreenSpinner />);
  //         return BrigadesAPI.getBrigade(queryKey[1] as number);
  //     },
  //     retry: 1,
  //     refetchOnWindowFocus: false,
  //     enabled: !!brigadeId,
  //     onSuccess: closePopout,
  // });

  const [search, setSearch] = useState<string>();
  const [, setFilter] = useState({
    search: undefined as string | undefined,
  });

  const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setFilterD(() => ({
        search: event.target.value,
      }));
    },
    [setFilterD]
  );
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Отчеты от сезонах
        </Title>
      </PanelHeader>

      <Group>
        <Search value={search} onChange={handleChange} />
        {/* <LazyList
          title="Бойцы"
          fetchFn={BrigadesAPI.getBrigadeSeasons}
          queryKey={`brigade-seasons-${brigadeId}`}
          extraFnProp={{
            brigadeId: brigadeId!,
            search: filter.search,
          }}
          enabled={!!brigadeId}
          renderItem={(item: Season) => <SeasonCell season={item} />}
        /> */}
      </Group>
    </Panel>
  );
});
