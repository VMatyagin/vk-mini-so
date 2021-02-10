import React, { FC } from "react";
import {
    PanelHeader,
    Title,
    Group,
    SimpleCell,
    Text,
    PanelHeaderBack,
} from "@vkontakte/vkui";
import { useMst } from "../../../../features/stores";
import { PanelTemplate } from "../../template/PanelTemplate";
import Icon28AddOutline from "@vkontakte/icons/dist/28/add_outline";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";
import Icon28InfoOutline from "@vkontakte/icons/dist/28/info_outline";
export const EventHandlePanel: FC<{ id: string }> = ({ id }) => {
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
                    Упр. мероприятиями
                </Title>
            </PanelHeader>
            <Group>
                <SimpleCell
                    before={<Icon28AddOutline />}
                    after={<Icon28ChevronRightOutline />}
                    onClick={() => changeView("event_add")}
                >
                    <Text weight="regular" style={{ color: "var(--accent)" }}>
                        Добавить мероприятие
                    </Text>
                </SimpleCell>
                <SimpleCell
                    before={<Icon28InfoOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changeView("event_search")}
                >
                    Найти существующее
                </SimpleCell>
            </Group>
        </PanelTemplate>
    );
};
