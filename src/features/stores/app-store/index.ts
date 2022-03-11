import {
  AppearanceSchemeType,
  GetLaunchParamsResponse,
  UserInfo,
} from "@vkontakte/vk-bridge";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { ScrollPosition, Viewer } from "../../types";

import {
  initApp,
  APP_ID,
  denyNotifications,
  allowNotifications,
} from "../../VKBridge";
import VKBridge from "@vkontakte/vk-bridge";
import { router } from "../../..";

export class AppStore {
  accessToken: string | null = null;
  userData: UserInfo | null = null;
  colorSchema: AppearanceSchemeType = "client_light";
  activeTab: Record<string, string> = {};
  componentScroll: Record<string, ScrollPosition> = {};
  user: Viewer | null = null;
  appParams: GetLaunchParamsResponse | null = null;
  queryString: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  async load() {
    this.queryString = window.location.search.slice(1);

    this.appParams = await VKBridge.send("VKWebAppGetLaunchParams");
    const user = await VKBridge.send("VKWebAppGetUserInfo");
    const token = await VKBridge.send("VKWebAppGetAuthToken", {
      app_id: APP_ID,
      scope: "groups",
    });

    this.userData = user;
    this.accessToken = token.access_token;
    await initApp();
  }

  public get isInitialization() {
    return !(this.user && this.userData && this.accessToken);
  }
  public get isStaff() {
    return this.user?.isStaff ?? false;
  }
  public get isNotificationsEnabled() {
    return !!this.appParams?.vk_are_notifications_enabled;
  }
  toggleNotifications = async () => {
    if (this.isNotificationsEnabled) {
      const data = await denyNotifications();
      if (data.result === true) {
        this.appParams!.vk_are_notifications_enabled = 0;
      }
    } else {
      const data = await allowNotifications();
      if (data.result === true) {
        this.appParams!.vk_are_notifications_enabled = 1;
      }
    }
  };

  setColorScheme = (colorSchema: AppearanceSchemeType) => {
    this.colorSchema = colorSchema;
  };
  setUserData = (data: UserInfo) => {
    this.userData = data;
  };
  setUser = (user: Viewer) => {
    if (this.user === null) {
      if (user.boec !== null) {
        router.navigate("else.base.base", {}, { replace: true });
      } else {
        router.navigate("init.onboarding", {}, { replace: true });
      }
    }

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
