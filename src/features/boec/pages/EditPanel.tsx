import { FC, useContext } from "react";
import { Panel, PanelHeaderBack, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";
import { UserEditMain } from "../ui/molecules/UserEditMain";
import { UserEditSeasons } from "../ui/molecules/UserEditSeasons";

export const EditPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack } = useContext(routerStore);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Боец
                </Title>
            </PanelHeader>
            <UserEditMain />
            <UserEditSeasons viewId={viewId} />
        </Panel>
    );
});
