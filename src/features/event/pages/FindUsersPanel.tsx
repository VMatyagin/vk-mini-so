import {
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Title,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { routerStore } from "../../stores/router-store";

export const FindUsersPanel: FC<{
    id: string;
    type: "organizers" | "volonteers";
}> = observer(({ id }) => {
    const { goBack } = useContext(routerStore);
    // const { eventData } = useContext(eventStore);

    // const handleUserAdd = (e: React.MouseEvent<HTMLElement>) => {
    //     const userId = e.currentTarget.dataset.userid!;
    //     eventData &&
    //         SoAPI.addEventUser(eventData.id, type, Number(userId)).then(() =>
    //             goBack()
    //         );
    // };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Поиск
                </Title>
            </PanelHeader>
            <Group></Group>
        </Panel>
    );
});
