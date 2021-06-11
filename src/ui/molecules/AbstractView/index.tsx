import { View, ViewProps } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { routerStore } from "../../../features/stores/router-store";

interface AbstractViewProps extends Omit<ViewProps, "activePanel"> {
    id: string;
}
export const AbstractView: FC<AbstractViewProps> = observer(
    ({ id, children }) => {
        const { panelsHistory, getActivePanel, goBack } =
            useContext(routerStore);

        const history =
            panelsHistory[id] === undefined ? [id] : panelsHistory[id];

        return (
            <View
                id={id}
                activePanel={getActivePanel(id)}
                history={history}
                onSwipeBack={goBack}
            >
                {children}
            </View>
        );
    }
);
