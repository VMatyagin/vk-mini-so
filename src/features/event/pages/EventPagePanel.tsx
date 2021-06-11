import React, { FC, useContext } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Group,
    SimpleCell,
    Switch,
    Panel,
    CellButton,
} from "@vkontakte/vkui";

import {
    Icon28ChevronRightOutline,
    Icon28FireOutline,
    Icon28InboxOutline,
    Icon28UsersOutline,
    Icon28WalletOutline,
} from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { EventCard } from "../../../ui/molecules/EventCard";
import { routerStore } from "../../stores/router-store";
import { eventStore } from "../store/eventStore";

export const EventPagePanel: FC<{ id: string }> = observer(({ id }) => {
    const { setPage, goBack } = useContext(routerStore);
    const { eventData, reset, toggleVisibility } = useContext(eventStore);
    const changeView = (panel: string) => {
        setPage("else_event_handle", panel);
    };
    const onBack = () => {
        goBack();
        reset();
    };
    return eventData ? (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={onBack} />}>
                <Title level="2" weight="bold">
                    {eventData.title}
                </Title>
            </PanelHeader>
            <Group>
                <EventCard
                    title={eventData.title}
                    startDate={eventData.startDate}
                    startTime={eventData.startTime}
                    description={eventData.description}
                    key={eventData.id}
                />
            </Group>
            <Group description="Включает отображение мероприятия в календаре">
                <SimpleCell
                    onClick={() => eventData && toggleVisibility(eventData.id)}
                    after={
                        <Switch
                            checked={eventData.visibility}
                            readOnly={true}
                        />
                    }
                >
                    Видимость
                </SimpleCell>
            </Group>
            <Group>
                <SimpleCell
                    before={<Icon28WalletOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_page_wallets")}
                >
                    Билеты
                </SimpleCell>
                <SimpleCell
                    before={<Icon28FireOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_organizers")}
                >
                    Организаторы
                </SimpleCell>
                <SimpleCell
                    before={<Icon28UsersOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_volonteers")}
                >
                    Волонтеры
                </SimpleCell>
                <SimpleCell
                    before={<Icon28InboxOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_orders")}
                >
                    Заявки
                </SimpleCell>
            </Group>
            <Group>
                <CellButton onClick={() => changeView("event_edit")}>
                    Редактировать
                </CellButton>
            </Group>
        </Panel>
    ) : null;
});
