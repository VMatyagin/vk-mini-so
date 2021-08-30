import { createRouter } from "router5";
import loggerPlugin from "router5-plugin-logger";
import browserPlugin from "router5-plugin-browser";
import { routes } from "./routes";

export const configureRouter = (useLoggerPlugin = false) => {
  const router = createRouter(routes, { defaultRoute: "else.base.base" });

  if (useLoggerPlugin) {
    router.usePlugin(loggerPlugin);
  }
  router.usePlugin(
    browserPlugin({
      useHash: true,
    })
  );
  return router;
};
