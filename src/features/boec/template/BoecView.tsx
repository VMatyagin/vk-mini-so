import { FC, useContext } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { Seasons, ViewProps } from "../../types";
import { useQuery } from "react-query";
import { boecStore } from "../store/boecStore";
import { UsersAPI } from "../../utils/requests/user-request";
import { ViewPanel } from "../pages/ViewPanel";
import { EditPanel } from "../pages/EditPanel";
import { SeasonEditPanel } from "../pages/SeasonEditPanel";
import { ListPanel } from "../pages/ListPanel";

export const BoecView: FC<ViewProps> = observer(({ id }) => {
    const { boecId, setSeasons } = useContext(boecStore);

    useQuery<Seasons[]>({
        queryKey: ["seasons", boecId],
        queryFn: ({ queryKey }) =>
            UsersAPI.getUserSeasons(queryKey[1] as number),
        retry: 1,
        refetchOnWindowFocus: false,
        onSuccess: setSeasons,
    });

    return (
        <AbstractView id={id}>
            <ViewPanel id="base" viewId={id} />
            <EditPanel id="edit" viewId={id} />
            <SeasonEditPanel id="season" viewId={id} />
            <ListPanel id="list" viewId={id} />
        </AbstractView>
    );
});
