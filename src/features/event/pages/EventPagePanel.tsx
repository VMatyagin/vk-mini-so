import React, { FC } from "react";
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

import { Icon28ChevronRightOutline, Icon28FireOutline, Icon28InboxOutline, Icon28UsersOutline, Icon28WalletOutline } from "@vkontakte/icons";
import { observer } from "mobx-react";
import { useMst } from "../../stores";
import { EventCard } from "../../../ui/molecules/EventCard";

export const EventPagePanel: FC<{ id: string }> = observer(({ id }) => {
    const { router, event } = useMst();
    const changeView = (panel: string) => {
        router.setPage("else_event_handle", panel);
    };
    const onBack = () => {
        router.goBack();
        event.reset();
    };
    return event.eventData ? (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={onBack} />}>
                <Title level="2" weight="bold">
                    {event.eventData.title}
                </Title>
            </PanelHeader>
            <Group>
                <EventCard
                    title={event.eventData.title}
                    startDate={event.eventData.startDate}
                    startTime={event.eventData.startTime}
                    description={event.eventData.description}
                    key={event.eventData.id}
                />
            </Group>
            <Group description="Включает отображение мероприятия в календаре">
                <SimpleCell
                    onClick={() =>
                        event.eventData &&
                        event.toggleVisibility(event.eventData.id)
                    }
                    after={
                        <Switch
                            checked={event.eventData.visibility}
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
