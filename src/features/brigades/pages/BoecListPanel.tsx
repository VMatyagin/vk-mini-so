import { FC, useContext, useState } from "react";
import {
    Group,
    Header,
    Link,
    Panel,
    PanelHeaderBack,
    PanelSpinner,
    ScreenSpinner,
    SimpleCell,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { brigadeStore } from "../store/brigadeStore";
import { Boec, Seasons } from "../../types";
import { toJS } from "mobx";
import { boecStore } from "../../boec/store/boecStore";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { useQuery } from "react-query";

const sortByFirstSeason = (seasons: Seasons[]) => {
    let usedUsers = new Set();
    return Object.entries(
        seasons
            .sort((a, b) => a.year - b.year)
            .reduce((prev, current) => {
                if (usedUsers.has(toJS(current.boec.id))) {
                    return prev;
                }
                usedUsers.add(toJS(current.boec.id));

                return {
                    ...prev,
                    [current.year]: [
                        ...(prev[current.year] || []),
                        current.boec,
                    ],
                };
            }, {} as Record<string, Boec[]>)
    );
};

const sortByYear = (seasons: Seasons[]) => {
    return Object.entries(
        seasons
            .sort((a, b) => a.year - b.year)
            .reduce(
                (prev, current) => ({
                    ...prev,
                    [current.year]: [
                        ...(prev[current.year] || []),
                        current.boec,
                    ],
                }),
                {} as Record<string, Boec[]>
            )
    );
};

export const BoecListPanel: FC<{ id: string }> = observer(({ id }) => {
    const { goBack, setPage, openPopout, closePopout } =
        useContext(routerStore);
    const { brigadeId } = useContext(brigadeStore);
    const { setBoecId } = useContext(boecStore);
    const [sort, setSortType] = useState<boolean>(false);

    const { data: seasons } = useQuery({
        queryKey: ["seasons", brigadeId],
        queryFn: ({ queryKey }) => {
            openPopout(<ScreenSpinner />);
            return BrigadesAPI.getBrigadeSeasons({
                brigadeId: queryKey[1] as number,
            });
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!brigadeId,
        onSuccess: closePopout,
    });

    const { data: brigade } = useQuery({
        queryKey: ["brigade", brigadeId],
        queryFn: ({ queryKey }) => {
            openPopout(<ScreenSpinner />);
            return BrigadesAPI.getBrigade(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!brigadeId,
        onSuccess: closePopout,
    });

    const openBoec = (boecId: number) => {
        setBoecId(boecId);
        setPage("boec", "base");
    };

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    {brigade?.title}
                </Title>
            </PanelHeader>
            <Header
                mode="primary"
                aside={
                    <Link onClick={() => setSortType((prev) => !prev)}>
                        {sort === false ? "По году выезда" : "По году набора"}
                    </Link>
                }
            >
                Бойцы
            </Header>

            {seasons ? (
                (sort === true
                    ? sortByYear(seasons)
                    : sortByFirstSeason(seasons)
                )
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map((item) => (
                        <Group
                            key={item[0]}
                            header={<Header mode="secondary">{item[0]}</Header>}
                        >
                            {item[1].map((boec: Boec) => (
                                <SimpleCell
                                    key={boec.id}
                                    onClick={() => openBoec(boec.id)}
                                >
                                    {boec.fullName}
                                </SimpleCell>
                            ))}
                        </Group>
                    ))
            ) : (
                <PanelSpinner />
            )}
        </Panel>
    );
});
