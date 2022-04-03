import { createRouter } from "router5";
import loggerPlugin from "router5-plugin-logger";
import browserPlugin from "router5-plugin-browser";

import { routes } from "./routes";
import { RouterStoreInstance } from "./features/stores/router-store";

export const configureRouter = () => {
    const router = createRouter(routes, {
        defaultRoute: "else.base",
        trailingSlashMode: "always",
        strictTrailingSlash: true
    });

    if (process.env.NODE_ENV !== "production") {
        router.usePlugin(loggerPlugin);
    }
    router.subscribe(route => {
        if (route.route.meta?.source === "popstate") {
            RouterStoreInstance.closeModalStack();
            RouterStoreInstance.closePopout();
        }
    });
    router.usePlugin(
        browserPlugin({
            useHash: true
        })
    );

    return router;
};
