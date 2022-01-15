import { AppearanceSchemeType, UserInfo } from "@vkontakte/vk-bridge";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { ScrollPosition, Viewer } from "../../types";

import { initApp, APP_ID } from "../../VKBridge";
import VKBridge from "@vkontakte/vk-bridge";

export class AppStore {
  accessToken: string | null = null;
  userData: UserInfo | null = null;
  colorSchema: AppearanceSchemeType = "client_light";
  activeTab: Record<string, string> = {};
  componentScroll: Record<string, ScrollPosition> = {};
  user: Viewer | null = null;
  appParams: Record<string, any> | null = null;
  queryString: string | undefined = undefined;

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

  setColorScheme = (colorSchema: AppearanceSchemeType) => {
    this.colorSchema = colorSchema;
  };
  setUserData = (data: UserInfo) => {
    this.userData = data;
  };
  setUser = (user: Viewer) => {
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
  setAppParams = (searchParams: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);

    const params = Object.fromEntries(urlSearchParams.entries());
    this.appParams = params;
    console.log(params);

    this.queryString = searchParams.slice(1);
  };
}

export const AppStoreInstance = new AppStore();

export const appStore = createContext(AppStoreInstance);
