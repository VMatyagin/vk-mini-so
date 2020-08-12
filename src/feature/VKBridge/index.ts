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

    VKBridge.subscribe(VKConnectCallback);

    return VKBridge.send("VKWebAppInit", {})
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

export const getAuthToken = (scope: any) => {
    VKBridge.send("VKWebAppGetAuthToken", {
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
export const getUserData = async () => {
    await VKBridge.send("VKWebAppGetUserInfo")
        .then((data) => {
            rootStore.app.setUserData({
                id: data.id,
                last_name: data.last_name,
                first_name: data.first_name,
                photo: data.photo_max_orig
                    ? data.photo_max_orig
                    : data.photo_200,
            });
        })
        .catch(() => {
            rootStore.app.setUserData({
                id: 0,
                last_name: "Ошибка загрузки",
                first_name: "",
                photo: "",
            });
        });
};

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

export const APICall = (
    method: string,
    params: Record<string, string | number>
) => {
    params["access_token"] = rootStore.app.accessToken;
    params["v"] = params["v"] === undefined ? API_VERSION : params["v"];

    return VKBridge.send("VKWebAppCallAPIMethod", {
        method: method,
        params: params,
    })
        .then((data) => {
            return data.response;
        })
        .catch((error) => {
            return error;
        });
};
