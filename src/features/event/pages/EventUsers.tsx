import { FC, useCallback, useEffect, useState } from "react";
import {
    PanelHeader,
    PanelHeaderBack,
    Title,
    Group,
    SimpleCell,
    Panel,
    Header,
    CellButton,
    Alert,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";

import { useMst } from "../../stores";
import { Boec } from "../../types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { Icon24Add, Icon24Cancel } from "@vkontakte/icons";
import { ItemsList } from "../molecules/ItemsList";

const titles = {
    organizers: {
        title: "Организаторы",
        btn: "организатора",
    },
    volonteers: {
        title: "Волонтеры",
        btn: "волонтера",
    },
};

export const EventUsers: FC<{
    id: string;
    type: "organizers" | "volonteers";
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

    const onAdd = () => {
        router.setPage("else_event_handle", `event_find_${type}`);
    };
    const onDelete = (clickEvent: React.MouseEvent<HTMLElement>) => {
        const userId = clickEvent.currentTarget.dataset.userid;
        router.openPopout(
            <Alert
                actions={[
                    {
                        title: "Удалить",
                        mode: "destructive",
                        autoclose: true,
                        action: () => {
                            if (userId && event.eventData) {
                                SoAPI.removeEventUser(
                                    event.eventData.id,
                                    type,
                                    Number(userId)
                                ).then(({ data }) => setData(data));
                            }
                        },
                    },
                    {
                        title: "Отмена",
                        autoclose: true,
                        mode: "cancel",
                    },
                ]}
                actionsLayout="vertical"
                onClose={router.closePopout}
                header="Подтвердите действие"
                text="Вы уверены, что хотите удалить это мероприятие?"
            />
        );
    };

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
                <CellButton before={<Icon24Add />} onClick={onAdd}>
                    Добавить {titles[type].btn}
                </CellButton>
                <ItemsList
                    data={data}
                    isLoading={isLoading}
                    isError={!!errors}
                    renderItem={(item) => (
                        <SimpleCell
                            key={item.id}
                            after={
                                <Icon24Cancel
                                    onClick={onDelete}
                                    data-userid={item.id}
                                />
                            }
                        >
                            {item.fullName}
                        </SimpleCell>
                    )}
                />
            </Group>
        </Panel>
    );
});
