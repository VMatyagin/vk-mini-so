import { FC, useContext, useEffect } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ViewProps } from "../../types";
import { boecStore } from "../store/boecStore";
import { ViewPanel } from "../pages/ViewPanel";
import { EditPanel } from "../pages/EditPanel";
import { SeasonEditPanel } from "../pages/SeasonEditPanel";
import { ListPanel } from "../pages/ListPanel";
import { AchievementsPanel } from "../pages/AchievementsPanel";
import { appStore } from "../../stores/app-store";

export const BoecView: FC<ViewProps> = observer(({ id }) => {
    const { boecId, setBoecId } = useContext(boecStore);
    const { user } = useContext(appStore);

    useEffect(() => {
        if (user && !boecId) {
            setBoecId(user.boec.id);
        }
    }, [boecId, setBoecId, user]);

    useEffect(() => {
        return () => {
            setBoecId(null);
        };
    }, [setBoecId]);
    return (
        <AbstractView id={id}>
            <ViewPanel id="base" viewId={id} />
            <EditPanel id="edit" viewId={id} />
            <SeasonEditPanel id="season" viewId={id} />
            <AchievementsPanel id="achievements" viewId={id} />
            <ListPanel id="list" viewId={id} />
        </AbstractView>
    );
});
