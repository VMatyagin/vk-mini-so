import React, { FC } from "react";
import { PanelTemplate } from "../../template/PanelTemplate";
import {
    PanelHeader,
    PanelHeaderBack,
    Title,
    Group,
    SimpleCell,
    Avatar,
    Button,
} from "@vkontakte/vkui";
import { useMst } from "../../../../feature/stores";
import { observer } from "mobx-react";
import Icon28EditOutline from "@vkontakte/icons/dist/28/edit_outline";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";

const titles = {
    admins: {
        title: "Организаторы",
        btn: "организатора",
    },
    volunteers: {
        title: "Волонтеры",
        btn: "волонтера",
    },
    artists: {
        title: "Выступающие",
        btn: "выступающих",
    },
};

export const EventUsers: FC<{
    id: string;
    type: "admins" | "volunteers" | "artists";
}> = observer(({ id, type }) => {
    const store = useMst();
    return (
        <PanelTemplate id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    {titles[type].title}
                </Title>
            </PanelHeader>
            <Group>
                {Array(3)
                    .fill("1")
                    .map((item, index) => {
                        if (type === "artists") {
                            return (
                                <Group>
                                    <SimpleCell
                                        before={<Icon28UsersOutline />}
                                        after={
                                            <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                                        }
                                        description="Танцы в пустоту"
                                    >
                                        СПО "Глазки"
                                    </SimpleCell>
                                </Group>
                            );
                        } else {
                            return (
                                <SimpleCell
                                    before={
                                        <Avatar
                                            size={48}
                                            src="https://sun9-47.userapi.com/impg/c854016/v854016279/21cd10/84GL9KrDlWs.jpg?size=0x0&quality=90&sign=a611379738e0498eef52ccaddecf37ce&ava=1"
                                        />
                                    }
                                    description="Помощь с помощью (божественной)"
                                    after={<Icon28EditOutline />}
                                >
                                    Имя фамилия
                                </SimpleCell>
                            );
                        }
                    })}
            </Group>
            <Group
                description={
                    type === "artists"
                        ? "Выступающие не получают билет. Они находятся в квоте штаба"
                        : ""
                }
            >
                <Button size="l" mode="tertiary" before={<Icon24Add />}>
                    Добавить {titles[type].btn}
                </Button>
            </Group>
        </PanelTemplate>
    );
});
