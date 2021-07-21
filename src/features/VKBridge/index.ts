import VKBridge, {
    VKBridgeEvent,
    AnyReceiveMethodName,
    UserGetFriendsFriend,
} from "@vkontakte/vk-bridge";
import { AppStoreInstance } from "../stores/app-store";

export const APP_ID = 7555628;
export const API_VERSION = "5.122";

export const initApp = async () => {
    const VKConnectCallback = (e: VKBridgeEvent<AnyReceiveMethodName>) => {
        if (e.detail.type === "VKWebAppUpdateConfig") {
            VKBridge.unsubscribe(VKConnectCallback);
            AppStoreInstance.setColorScheme(e.detail.data.scheme);
        }
    };
    VKBridge.subscribe(VKConnectCallback);

    try {
        const data = await VKBridge.send("VKWebAppInit", {});
        return data;
    } catch (error) {
        return error;
    }
};

export const getAuthToken = async (scope: any) => {
    await VKBridge.send("VKWebAppGetAuthToken", {
        app_id: APP_ID,
        scope: scope.join(","),
    })
        .then((data) => {
            AppStoreInstance.setAccessToken(data.access_token);
        })
        .catch(() => {
            AppStoreInstance.setAccessToken(null);
        });
};

export const closeApp = async () => {
    try {
        const data = await VKBridge.send("VKWebAppClose", {
            status: "success",
        });
        return data;
    } catch (error) {
        return error;
    }
};

export const swipeBackOn = async () => {
    try {
        const data = await VKBridge.send("VKWebAppEnableSwipeBack", {});
        return data;
    } catch (error) {
        return error;
    }
};

export const swipeBackOff = async () => {
    try {
        const data = await VKBridge.send("VKWebAppDisableSwipeBack", {});
        return data;
    } catch (error) {
        return error;
    }
};

export const APICall = async (
    method: string,
    params: Record<string, string>,
    access_token: string
) => {
    try {
        const data = await VKBridge.send("VKWebAppCallAPIMethod", {
            method,
            params: {
                ...params,
                access_token,
                v: params["v"] === undefined ? API_VERSION : params["v"],
            },
        });
        return data.response;
    } catch (error) {
        return error;
    }
};
export const selectVKUsers = async (): Promise<UserGetFriendsFriend[]> => {
    try {
        const data = await VKBridge.send("VKWebAppGetFriends", {
            multi: false,
        });
        return data.users;
    } catch (error) {
        return error;
    }
};
export const allowNotifications = async (): Promise<{
    result: true;
}> => {
    try {
        const data = await VKBridge.send("VKWebAppAllowNotifications");
        return data;
    } catch (error) {
        return error;
    }
};
export const denyNotifications = async (): Promise<{
    result: true;
}> => {
    try {
        const data = await VKBridge.send("VKWebAppDenyNotifications");
        return data;
    } catch (error) {
        return error;
    }
};
