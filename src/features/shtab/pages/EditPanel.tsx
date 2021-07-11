import { FC, useContext, useState } from "react";
import { Panel, PanelHeaderBack, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { routerStore } from "../../stores/router-store";
import { PanelProps } from "../../types";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { MainInfoForm } from "../ui/molecules/MainInfoForm";
import { PositionsForm } from "../../brigades/ui/molecules/PositionsForm";
import { shtabStore } from "../store/shtabStore";

export const EditPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const { goBack } = useContext(routerStore);
    const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
    const onSuccess = () => {
        setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
    };
    const { shtabId } = useContext(shtabStore);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Редактирование штаба
                </Title>
            </PanelHeader>

            <MainInfoForm onSuccess={onSuccess} />
            <PositionsForm shtabId={shtabId!} />
            {SnackBar}
        </Panel>
    );
});
