import React, { FC } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Search,
    Group,
} from "@vkontakte/vkui";
import { useMst } from "../../../../features/stores";
import { PanelTemplate } from "../../template/PanelTemplate";
import { EventCard } from "../../../molecules/EventCard";
export const SearchPanel: FC<{ id: string }> = ({ id }) => {
    const store = useMst();
    const changeView = () => {
        store.router.setPage("else_event_handle", "event_page");
    };
    return (
        <PanelTemplate id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    Поиск
                </Title>
            </PanelHeader>
            <Search />

            <Group>
                <EventCard onClick={changeView} />
            </Group>
        </PanelTemplate>
    );
};
