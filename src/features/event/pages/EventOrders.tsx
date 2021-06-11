import { FC, useContext } from "react";
import {
    PanelHeader,
    PanelHeaderBack,
    Title,
    Group,
    Button,
    Panel,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";

import { Icon24Add } from "@vkontakte/icons";
import { routerStore } from "../../stores/router-store";

export const EventOrders: FC<{
    id: string;
}> = observer(({ id }) => {
    const { setPage, goBack } = useContext(routerStore);

    // const onLoad = useCallback((data: EventOrder[]) => {
    //     setData(data);
    // }, []);

    // const { fetch, errors, isLoading } = useFetch(SoAPI.getEventOrders, onLoad);

    // useEffect(() => {
    //     eventData && fetch(eventData.id);
    // }, [fetch, eventData]);
    // const changeView = (id: number) => {
    //     openPopout(<ScreenSpinner />);
    //     fetchOrder(id, () => {
    //         setPage("else_event_handle", "event_order");
    //         closePopout();
    //     });
    // };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Заявки
                </Title>
            </PanelHeader>
            {/* <Group
                header={
                    <Header mode="tertiary" indicator={data?.length}>
                        Заявки
                    </Header>
                }
            >
                <ItemsList
                    data={data}
                    // isLoading={isLoading}
                    // isError={!!errors}
                    renderItem={(item) => (
                        <SimpleCell
                            key={item.id}
                            onClick={() => changeView(item.id)}
                        >
                            {`Заявка ${item.brigades.reduce(
                                (prev, cur) => (prev += ` ${cur.title}`),
                                ""
                            )}  ${item.title && `- ${item.title}`}
                        `}
                        </SimpleCell>
                    )}
                />
            </Group> */}
            <Group>
                <Button
                    size="l"
                    mode="tertiary"
                    stretched={true}
                    before={<Icon24Add />}
                    onClick={() => {
                        setPage("else_event_handle", "event_order");
                    }}
                >
                    Добавить заявку
                </Button>
            </Group>
        </Panel>
    );
});
