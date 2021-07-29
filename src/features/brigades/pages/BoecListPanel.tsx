import { FC, useCallback, useContext, useMemo, useState } from "react";
import { Group, Panel, PanelHeaderBack, Search, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { brigadeStore } from "../store/brigadeStore";
import { Seasons } from "../../types";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList } from "../../../ui/organisms/LazyList";
import { debounce } from "@vkontakte/vkjs";
import { SeasonCell } from "../ui/molecules/SeasonCell";

// const sortByFirstSeason = (seasons: Seasons[]) => {
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

// const sortByYear = (seasons: Seasons[]) => {
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

export const BoecListPanel: FC<{ id: string }> = observer(({ id }) => {
    const { goBack } = useContext(routerStore);
    const { brigadeId } = useContext(brigadeStore);

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
    const [filter, setFilter] = useState({
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
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Отчеты от сезонах
                </Title>
            </PanelHeader>

            <Group>
                <Search value={search} onChange={handleChange} />
                <LazyList
                    title="Бойцы"
                    fetchFn={BrigadesAPI.getBrigadeSeasons}
                    queryKey={`brigade-seasons-${brigadeId}`}
                    extraFnProp={{
                        brigadeId: brigadeId!,
                        search: filter.search,
                    }}
                    enabled={!!brigadeId}
                    renderItem={(item: Seasons) => <SeasonCell season={item} />}
                />
            </Group>
        </Panel>
    );
});
