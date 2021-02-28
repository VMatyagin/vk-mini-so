import { View, ViewProps } from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC } from "react";
import { useMst } from "../../../features/stores";

interface AbstractViewProps extends Omit<ViewProps, "activePanel"> {
    id: string;
}

export const AbstractView: FC<AbstractViewProps> = observer(
    ({ id, children, modal }) => {
        const store = useMst();

        let history =
            store.router.panelsHistory[id] === undefined
                ? [id]
                : store.router.panelsHistory[id];

        return (
            <View
                id={id}
                activePanel={store.router.getActivePanel(id)}
                history={history}
                modal={modal}
                onSwipeBack={() => store.router.goBack()}
            >
                {children}
            </View>
        );
    }
);
