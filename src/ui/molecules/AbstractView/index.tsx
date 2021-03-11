import { View, ViewProps } from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { createContext, FC, useCallback, useState } from "react";
import { useMst } from "../../../features/stores";

interface AbstractViewProps extends Omit<ViewProps, "activePanel"> {
    id: string;
}
export interface ModelContextInstance<F extends VoidFunction> {
    onClose: F;
    setOnClose: Function;
}

export const ModalContext = createContext<ModelContextInstance<VoidFunction>>({
    setOnClose: () => undefined,
    onClose: () => () => undefined,
});

export const AbstractView: FC<AbstractViewProps> = observer(
    ({ id, children, modal }) => {
        const store = useMst();
        const [onClose, setOnClose] = useState<() => VoidFunction>(() => () =>
            undefined
        );

        let history =
            store.router.panelsHistory[id] === undefined
                ? [id]
                : store.router.panelsHistory[id];
        const set = useCallback((fn: VoidFunction) => {
            setOnClose(() => () => fn);
        }, []);
        return (
            <ModalContext.Provider
                value={{
                    onClose: onClose(),
                    setOnClose: set,
                }}
            >
                <View
                    id={id}
                    activePanel={store.router.getActivePanel(id)}
                    history={history}
                    modal={modal}
                    onSwipeBack={() => store.router.goBack()}
                >
                    {children}
                </View>
            </ModalContext.Provider>
        );
    }
);
