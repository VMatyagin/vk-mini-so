import { types } from "mobx-state-tree";

interface Position {
    x: number;
    y: number;
}

interface User {
    id: number;
    last_name: string;
    first_name: string;
    photo: string;
}

export const AppStore = types
    .model("AppStore", {
        accessToken: types.optional(types.string, ""),
        userData: types.optional(
            types.model({
                id: types.number,
                first_name: types.string,
                last_name: types.string,
                photo: types.string,
            }),
            {
                id: 0,
                first_name: "",
                last_name: "",
                photo: "",
            }
        ),
        colorSchema: types.optional(
            types.union(
                types.literal("client_light"),
                types.literal("client_dark"),
                types.literal("space_gray"),
                types.literal("bright_light")
            ),
            "client_light"
        ),
        activeTab: types.map(types.frozen<string>()),
        componentScroll: types.frozen<{ [propName: string]: Position }>({}),
    })
    .actions((self) => ({
        setColorScheme(
            colorSchema:
                | "client_light"
                | "client_dark"
                | "space_gray"
                | "bright_light"
        ) {
            self.colorSchema = colorSchema;
        },
        setUserData(data: User) {
            self.userData = data;
        },
        setAccessToken(accessToken: string) {
            self.accessToken = accessToken;
        },
        setActiveTab(component: string, tab: string) {
            self.activeTab.set(component, tab);
        },
        setScrollPosition(component: string, position: Position) {
            self.componentScroll[component] = position;
        },
        setScrollPositionById(component: string) {
            const element = document
                .getElementById(component)!
                .getElementsByClassName("HorizontalScroll__in")[0];
            const x = element.scrollLeft;
            const y = element.scrollTop;
            self.componentScroll[component] = { x, y };
        },
    }));
