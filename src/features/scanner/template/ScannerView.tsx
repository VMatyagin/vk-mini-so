import { FC } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ViewPanel } from "../pages/ViewPanel";
import { ScanPanel } from "../pages/ScanPanel";

export const ScannerView: FC<{ id: string }> = observer(({ id }) => {
    return (
        <AbstractView id={id}>
            <ViewPanel id="base" viewId={id} />
            <ScanPanel id="scan" viewId={id} />
        </AbstractView>
    );
});
