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

import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";
import Icon28WalletOutline from "@vkontakte/icons/dist/28/wallet_outline";
import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28PlaylistOutline from "@vkontakte/icons/dist/28/playlist_outline";
import Icon28PollSquareOutline from "@vkontakte/icons/dist/28/poll_square_outline";
import { Icon28FireOutline } from "@vkontakte/icons";
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
                    before={<Icon28PlaylistOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_page_artists")}
                >
                    Выступающие
                </SimpleCell>
                <SimpleCell
                    before={<Icon28PollSquareOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_page_winners")}
                >
                    Победители
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
