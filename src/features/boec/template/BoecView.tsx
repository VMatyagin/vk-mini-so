import { FC, useContext, useEffect } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ViewProps } from "../../types";
import { boecStore } from "../store/boecStore";
import { ViewPanel } from "../pages/ViewPanel";
import { EditPanel } from "../pages/EditPanel";
import { SeasonEditPanel } from "../pages/SeasonEditPanel";
import { ListPanel } from "../pages/ListPanel";
import { HistoryPanel } from "../pages/HistoryPanel";

export const BoecView: FC<ViewProps> = observer(({ id }) => {
    const { clear } = useContext(boecStore);

    useEffect(() => {
        return () => {
            clear();
        };
    }, [clear]);
    return (
        <AbstractView id={id}>
            <ViewPanel id="base" viewId={id} />
            <EditPanel id="edit" viewId={id} />
            <SeasonEditPanel id="season" viewId={id} />
            <HistoryPanel id="history" viewId={id} />
            <ListPanel id="list" viewId={id} />
        </AbstractView>
    );
});
