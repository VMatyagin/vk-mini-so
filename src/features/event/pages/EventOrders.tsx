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
    ScreenSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";

import { useMst } from "../../stores";
import { EventOrder } from "../../types";
import { useFetch } from "../../utils/useFetch";
import { SoAPI } from "../../utils/api.service";
import { Icon24Add } from "@vkontakte/icons";

export const EventOrders: FC<{
    id: string;
}> = observer(({ id }) => {
    const { event, router } = useMst();
    const [data, setData] = useState<EventOrder[]>();

    const onLoad = useCallback((data: EventOrder[]) => {
        setData(data);
    }, []);

    const { fetch, errors, isLoading } = useFetch(SoAPI.getEventOrders, onLoad);

    useEffect(() => {
        event.eventData && fetch(event.eventData.id);
    }, [fetch, event]);
    const changeView = (id: number) => {
        router.openPopout(<ScreenSpinner />);
        event.fetchOrder(id, () => {
            router.setPage("else_event_handle", "event_order");
            router.closePopout();
        });
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                <Title level="2" weight="bold">
                    Заявки
                </Title>
            </PanelHeader>
            <Group
                header={
                    <Header mode="tertiary" indicator={data?.length}>
                        Заявки
                    </Header>
                }
            >
                {data &&
                    data.map((item) => (
                        <SimpleCell
                            key={item.id}
                            onClick={() => changeView(item.id)}
                        >
                            {`Заявка ${item.brigade.title}  ${
                                item.title && `- ${item.title}`
                            }
                            `}
                        </SimpleCell>
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
                <Button
                    size="l"
                    mode="tertiary"
                    stretched={true}
                    before={<Icon24Add />}
                    onClick={() => {
                        router.setPage("else_event_handle", "event_order");
                    }}
                >
                    Добавить заявку
                </Button>
            </Group>
        </Panel>
    );
});
