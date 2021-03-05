import React, { FC, useCallback, useEffect, useState } from "react";
import {
    PanelHeader,
    PanelHeaderBack,
    Title,
    Group,
    SimpleCell,
    Button,
    Panel,
    Spinner,
    Footer,
    Header,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";

import { useMst } from "../../stores";
import { Boec } from "../../types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { Icon24Add } from "@vkontakte/icons";

const titles = {
    organizers: {
        title: "Организаторы",
        btn: "организатора",
    },
    volonteers: {
        title: "Волонтеры",
        btn: "волонтера",
    },
    artists: {
        title: "Выступающие",
        btn: "выступающих",
    },
};

export const EventUsers: FC<{
    id: string;
    type: "organizers" | "volonteers" | "artists";
}> = observer(({ id, type }) => {
    const { event, router } = useMst();
    const [data, setData] = useState<Boec<true>[]>();

    const onLoad = useCallback((data: Boec<true>[]) => {
        setData(data);
    }, []);

    const { fetch, errors, isLoading } = useFetch(SoAPI.getEventUsers, onLoad);

    useEffect(() => {
        event.eventData && fetch(event.eventData.id, type);
    }, [fetch, event, type]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                <Title level="2" weight="bold">
                    {titles[type].title}
                </Title>
            </PanelHeader>
            <Group
                header={
                    <Header mode="tertiary" indicator={data?.length}>
                        {titles[type].title}
                    </Header>
                }
            >
                {data &&
                    data.map((item) => (
                        <SimpleCell key={item.id}>{item.fullName}</SimpleCell>
                    ))}
                {isLoading && !errors && (
                    <Spinner size="small" style={{ margin: "20px 0" }} />
                )}
                {!isLoading && data && data.length === 0 && (
                    <Footer>Ничего не найдено</Footer>
                )}
                {errors && <Footer>Ошибка соединения</Footer>}
            </Group>
            <Group>
                <Button size="l" mode="tertiary" before={<Icon24Add />}>
                    Добавить {titles[type].btn}
                </Button>
            </Group>
        </Panel>
    );
});
