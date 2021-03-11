import VKBridge, {
    VKBridgeEvent,
    AnyReceiveMethodName,
} from "@vkontakte/vk-bridge";
import { rootStore } from "../stores";

const APP_ID = 7555628;
const API_VERSION = "5.122";

export const initApp = () => {
    const VKConnectCallback = (e: VKBridgeEvent<AnyReceiveMethodName>) => {
        if (e.detail.type === "VKWebAppUpdateConfig") {
            VKBridge.unsubscribe(VKConnectCallback);
            rootStore.app.setColorScheme(e.detail.data.scheme);
        }
    };
    window.localStorage.setItem(
        "token",
        "ab25c2d1948653c69da205d325f1bcce00500b0b"
    );

    VKBridge.subscribe(VKConnectCallback);

    return VKBridge.send("VKWebAppInit", {})
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

export const getAuthToken = async (scope: any) => {
    await VKBridge.send("VKWebAppGetAuthToken", {
        app_id: APP_ID,
        scope: scope.join(","),
    })
        .then((data) => {
            rootStore.app.setAccessToken(data.access_token);
        })
        .catch(() => {
            rootStore.app.setAccessToken("");
        });
};
export const getUserData = () => VKBridge.send("VKWebAppGetUserInfo");

export const closeApp = () => {
    return VKBridge.send("VKWebAppClose", {
        status: "success",
    })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

export const swipeBackOn = () => {
    return VKBridge.send("VKWebAppEnableSwipeBack", {})
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

export const swipeBackOff = () => {
    return VKBridge.send("VKWebAppDisableSwipeBack", {})
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

export const getWallPosts = () => {
    return APICall("wall.get", {
        owner_id: "-12906",
        extended: "1",
        count: "10",
    });
};

export const APICall = (method: string, params: Record<string, string>) => {
    return VKBridge.send("VKWebAppCallAPIMethod", {
        method,
        params: {
            ...params,
            access_token: rootStore.app.accessToken,
            v: params["v"] === undefined ? API_VERSION : params["v"],
        },
    })
        .then((data) => {
            return data.response;
        })
        .catch((error) => {
            return error;
        });
};