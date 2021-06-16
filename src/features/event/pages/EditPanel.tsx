import { FC, useContext } from "react";
import { Panel, PanelHeaderBack, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";
import { MainInfoForm } from "../ui/organisms/MainInfoForm";
import { eventStore } from "../store/eventStore";

export const EditPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack } = useContext(routerStore);
    const { eventId } = useContext(eventStore);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    {eventId ? "Редактирование" : "Новое мероприятие"}
                </Title>
            </PanelHeader>
            <MainInfoForm />
        </Panel>
    );
});
