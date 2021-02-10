import React, { FC } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Group,
    SimpleCell,
    UsersStack,
    Caption,
    Div,
} from "@vkontakte/vkui";
import { useMst } from "../../../../features/stores";
import { PanelTemplate } from "../../template/PanelTemplate";
import Icon28FireOutline from "@vkontakte/icons/dist/28/fire_outline";
import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";
import styled from "styled-components";

const StyledCell = styled.span`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const AdminsPanel: FC<{ id: string }> = ({ id }) => {
    const store = useMst();
    const changePanel = (panel: string) => {
        store.router.setPage("else_event_handle", panel);
    };
    return (
        <PanelTemplate id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    Организаторы
                </Title>
            </PanelHeader>
            <Group>
                <SimpleCell
                    before={<Icon28FireOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changePanel("event_admins")}
                >
                    <StyledCell>
                        Гл. организаторы
                        <UsersStack
                            photos={[
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                            ]}
                            size="s"
                            layout="vertical"
                        />
                    </StyledCell>
                </SimpleCell>
            </Group>
            <Group>
                <SimpleCell
                    before={<Icon28UsersOutline />}
                    after={
                        <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                    }
                    onClick={() => changePanel("event_volunteers")}
                >
                    <StyledCell>
                        Волонтеры
                        <UsersStack
                            photos={[
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                                "https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1",
                            ]}
                            size="s"
                            layout="vertical"
                        />
                    </StyledCell>
                </SimpleCell>
            </Group>
            <Group>
                <Div style={{ color: "var(--icon_tertiary)" }}>
                    <Caption level="1" weight="regular">
                        Все организаторы автоматически получают билет
                    </Caption>
                    <br />
                    <Caption level="1" weight="regular">
                        Невозможно добавить людей сверх квоты организаторов /
                        волонтеров
                    </Caption>
                </Div>
            </Group>
        </PanelTemplate>
    );
};
