import { FC, useContext } from "react";
import { Panel, PanelHeaderBack, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";
import { CompetitionMainInfoForm } from "../ui/organisms/CompetitionMainInfoForm";
import { eventStore } from "../store/eventStore";

export const CompetitionEditPanel: FC<PanelProps> = observer(
    ({ id, viewId }) => {
        const { goBack } = useContext(routerStore);
        const { competitionId } = useContext(eventStore);

        return (
            <Panel id={id}>
                <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                    <Title level="2" weight="bold">
                        {competitionId ? "Редактирование" : "Новый конкурс"}
                    </Title>
                </PanelHeader>
                <CompetitionMainInfoForm />
            </Panel>
        );
    }
);
