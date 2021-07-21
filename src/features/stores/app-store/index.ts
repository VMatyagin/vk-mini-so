import { AppearanceSchemeType, UserInfo } from "@vkontakte/vk-bridge";
import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { ScrollPosition, User } from "../../types";
import VKBridge from "@vkontakte/vk-bridge";
import { APP_ID, initApp } from "../../VKBridge";
import { UsersAPI } from "../../utils/requests/user-request";

export class AppStore {
    isInitialization: boolean = true;
    accessToken: string | null = null;
    userData: UserInfo | null = null;
    colorSchema: AppearanceSchemeType = "client_light";
    activeTab: Record<string, string> = {};
    componentScroll: Record<string, ScrollPosition> = {};
    user: User | null = null;
    appParams: Record<string, any> | null = null;

    constructor() {
        makeAutoObservable(this);
        this.load();
    }

    async load() {
        const user = await VKBridge.send("VKWebAppGetUserInfo");
        const token = await VKBridge.send("VKWebAppGetAuthToken", {
            app_id: APP_ID,
            scope: "groups",
        });
        const meData = await UsersAPI.getMeData();
        this.user = meData;
        this.userData = user;
        this.accessToken = token.access_token;
        await initApp();
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        this.appParams = params;

        runInAction(() => {
            this.isInitialization = false;
        });
    }

    setColorScheme = (colorSchema: AppearanceSchemeType) => {
        this.colorSchema = colorSchema;
    };
    setUserData = (data: UserInfo) => {
        this.userData = data;
    };
    setUser = (user: User) => {
        this.user = user;
    };
    setAccessToken = (accessToken: string | null) => {
        this.accessToken = accessToken;
    };
    setActiveTab = (component: string, tab: string) => {
        this.activeTab = { ...this.activeTab, [component]: tab };
    };
    setScrollPosition = (component: string, position: ScrollPosition) => {
        this.componentScroll[component] = position;
    };
    setScrollPositionById = (component: string) => {
        const element = document
            .getElementById(component)!
            .getElementsByClassName("HorizontalScroll__in")[0];
        const x = element.scrollLeft;
        const y = element.scrollTop;
        this.componentScroll[component] = { x, y };
    };
}

export const AppStoreInstance = new AppStore();

export const appStore = createContext(AppStoreInstance);
