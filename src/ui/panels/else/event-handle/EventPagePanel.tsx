import React, { FC } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Group,
    SimpleCell,
    Switch,
    Button,
    Div,
} from "@vkontakte/vkui";
import { useMst } from "../../../../features/stores";
import { PanelTemplate } from "../../template/PanelTemplate";
import { EventCard } from "../../../molecules/EventCard";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";
import Icon28WalletOutline from "@vkontakte/icons/dist/28/wallet_outline";
import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28PlaylistOutline from "@vkontakte/icons/dist/28/playlist_outline";
import Icon28PollSquareOutline from "@vkontakte/icons/dist/28/poll_square_outline";
export const EventPagePanel: FC<{ id: string }> = ({ id }) => {
    const store = useMst();
    const changeView = (panel: string) => {
        store.router.setPage("else_event_handle", panel);
    };
    return (
        <PanelTemplate id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    Слет ССО
                </Title>
            </PanelHeader>
            <Group>
                <EventCard onClick={() => {}} />
            </Group>
            <Group description="Включает отображение мероприятия в календаре">
                <SimpleCell after={<Switch defaultChecked />}>
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
                    before={<Icon28UsersOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_page_admins")}
                >
                    Организаторы
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
                    Результаты (для рейтинга)
                </SimpleCell>
            </Group>
            <Group description="В дальнейшем только РО сможет изменять данные">
                <Div>
                    <Button disabled mode="outline" size="l">
                        Первичный расчет рейтинга
                    </Button>
                </Div>
            </Group>
        </PanelTemplate>
    );
};
