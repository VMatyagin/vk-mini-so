import React, { FC, useContext } from "react";
import {
    PanelHeader,
    Group,
    SimpleCell,
    PanelHeaderBack,
    Panel,
    CellButton,
} from "@vkontakte/vkui";
import Icon28AddOutline from "@vkontakte/icons/dist/28/add_outline";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";

import { Icon28SearchOutline } from "@vkontakte/icons";
import { routerStore } from "../../stores/router-store";

export const EventHandlePanel: FC<{ id: string }> = ({ id }) => {
    const { setPage, goBack } = useContext(routerStore);
    const changeView = (panel: string) => {
        setPage("else_event_handle", panel);
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                Управление мероприятиями
            </PanelHeader>
            <Group>
                <CellButton
                    before={<Icon28AddOutline />}
                    onClick={() => changeView("event_edit")}
                    after={<Icon28ChevronRightOutline />}
                >
                    Добавить мероприятие
                </CellButton>
                <SimpleCell
                    before={<Icon28SearchOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_search")}
                >
                    Найти существующее
                </SimpleCell>
            </Group>
        </Panel>
    );
};
