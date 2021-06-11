import { FC } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ViewProps } from "../../types";
import { ViewPanel } from "../pages/ViewPanel";
import { ListPanel } from "../pages/ListPanel";

export const ShtabView: FC<ViewProps> = observer(({ id }) => {
    return (
        <AbstractView id={id}>
            <ViewPanel id="base" viewId={id} />
            <ListPanel id="list" viewId={id} />

            {/* <EditPanel id="edit" viewId={id} />
            <SeasonEditPanel id="season" viewId={id} /> */}
        </AbstractView>
    );
});
