import { FC } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ListPanel } from "../pages/ListPanel";
import { ViewPanel } from "../pages/ViewPanel";
import { BoecListPanel } from "../pages/BoecListPanel";
import { EditPanel } from "../pages/EditPanel";

export const BrigadesView: FC<{ id: string }> = observer(({ id }) => {
    return (
        <AbstractView id={id}>
            <ListPanel id="base" />
            <ViewPanel id="details" viewId={id} />
            <BoecListPanel id="details_boecs_list" />
            <EditPanel id="edit" viewId={id} />
        </AbstractView>
    );
});
