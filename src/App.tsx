import { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import { AppLayout } from "./AppLayout";
import { appStore } from "./features/stores/app-store";
import { Intro } from "./ui/molecules/Intro";

export const App: FC = observer(({ children }) => {
    const { colorSchema, isInitialization } = useContext(appStore);

    return (
        <ConfigProvider scheme={colorSchema}>
            <AdaptivityProvider>
                <AppRoot>
                    {isInitialization ? (
                        <Intro />
                    ) : (
                        <AppLayout>{children}</AppLayout>
                    )}
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
});
