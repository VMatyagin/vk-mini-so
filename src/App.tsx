import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";
import { useMst } from "./features/stores";
import { initApp, getUserData } from "./features/VKBridge";

import { AppLayout } from "./AppLayout";

export const App: FC = observer(({ children }) => {
    const lastAndroidBackAction = useState<number>(0);
    const store = useMst();

    const {
        setStory,
        goBack,
        scrollPosition,
        activePanel,
        activeStory,
        activeView,
    } = store.router;
    useEffect(() => {
        setStory("users", "base");
        initApp();
        getUserData();
    }, [setStory]);

    useEffect(() => {
        const devFetch = async () => {
            const userObject = {
                id: 1,
                last_name: "test",
                first_name: "test",
                photo: "test",
            };
            store.app.setUserData(userObject);
            store.app.setSoData({
                position: "Кент",
                level: "1",
                id: 0,
            });
            store.app.setLoading(false);
        };
        // const fetch = async () => {
        //     await getUserData()
        //         .then(async (data) => {
        //             const userObject = {
        //                 id: data.id,
        //                 last_name: data.last_name,
        //                 first_name: data.first_name,
        //                 photo: data.photo_max_orig
        //                     ? data.photo_max_orig
        //                     : data.photo_200,
        //             };
        //             const bdId = (await strapi.init({
        //                 ...userObject,
        //             })) as number;
        //             store.app.setUserData(userObject);
        //             getAuthToken(["groups"]);

        //             store.app.setSoData({
        //                 position: "Кент",
        //                 level: "1",
        //                 id: bdId,
        //             });
        //             store.app.setLoading(false);
        //         })
        //         .catch(() => {
        //             store.app.setUserData({
        //                 id: 0,
        //                 last_name: "Ошибка загрузки",
        //                 first_name: "",
        //                 photo: "",
        //             });
        //         });
        // };
        devFetch();
        // fetch();
    }, [store.app]);

    return (
        <ConfigProvider scheme={store.app.colorSchema}>
            <AdaptivityProvider>
                <AppRoot>
                    <AppLayout
                        lastAndroidBackAction={lastAndroidBackAction}
                        goBack={goBack}
                        activePanel={activePanel}
                        activeView={activeView}
                        activeStory={activeStory}
                        scrollPosition={scrollPosition}
                    >
                        {children}
                    </AppLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
});
