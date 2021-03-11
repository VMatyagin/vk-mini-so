import { Icon20Add } from "@vkontakte/icons";
import {
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell,
    Title,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC } from "react";
import { useMst } from "../../stores";
import { LazyUsersList } from "../../users/LazyUsersList";
import { SoAPI } from "../../utils/api.service";

export const FindUsersPanel: FC<{
    id: string;
    type: "organizers" | "volonteers";
}> = observer(({ id, type }) => {
    const { router, event } = useMst();
    const handleUserAdd = (e: React.MouseEvent<HTMLElement>) => {
        const userId = e.currentTarget.dataset.userid!;
        event.eventData &&
            SoAPI.addEventUser(
                event.eventData.id,
                type,
                Number(userId)
            ).then(() => router.goBack());
    };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                <Title level="2" weight="bold">
                    Поиск
                </Title>
            </PanelHeader>
            <Group>
                <LazyUsersList
                    renderItem={(item) => (
                        <SimpleCell
                            key={item.id}
                            onClick={handleUserAdd}
                            after={<Icon20Add />}
                            data-userid={item.id}
                        >
                            {item.fullName}
                        </SimpleCell>
                    )}
                />
            </Group>
        </Panel>
    );
});
