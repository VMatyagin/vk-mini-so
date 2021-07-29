import {
    Icon28Newsfeed,
    Icon28ScanViewfinderOutline,
    Icon28UserSquareOutline,
} from "@vkontakte/icons";
import { Badge, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { appStore } from "../../../features/stores/app-store";
import { routerStore } from "../../../features/stores/router-store";


export const MobileMenu = observer(() => {
    const { activeStory, setStory } = useContext(routerStore);
    const { user } = useContext(appStore);

    return (
        <Tabbar itemsLayout="vertical" shadow={false}>
            <TabbarItem 
                onClick={() => setStory("else", "base", "else")}
                selected={activeStory === "else"}
                // text="Ещё"
            >
                <Icon28Newsfeed />
            </TabbarItem>
            <TabbarItem
                onClick={() => setStory("scanner", "base", "scanner")}
                selected={activeStory === "scanner"}
                // text="Сканнер"
            >
                <Icon28ScanViewfinderOutline />
            </TabbarItem>
            <TabbarItem
                onClick={() => setStory("profile", "base", "profile")}
                selected={activeStory === "profile"}
                // text="Профиль"
                indicator={
                    user?.unreadActivityCount! > 0 && (
                        <Badge mode="prominent" aria-label="Есть новые" />
                    )
                }
            >
                <Icon28UserSquareOutline />
            </TabbarItem>
        </Tabbar>
    );
});
