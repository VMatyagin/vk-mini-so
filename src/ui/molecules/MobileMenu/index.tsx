import { Icon28Newsfeed, Icon28UserSquareOutline } from "@vkontakte/icons";
import { Badge, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { routerStore } from "../../../features/stores/router-store";

export const MobileMenu = observer(() => {
    const { activeStory, setStory } = useContext(routerStore);

    return (
        <Tabbar itemsLayout="vertical">
            <TabbarItem
                onClick={() => setStory("else", "base")}
                selected={activeStory === "else"}
                text="Ещё"
            >
                <Icon28Newsfeed />
            </TabbarItem>
            <TabbarItem
                onClick={() => setStory("profile", "base")}
                selected={activeStory === "profile"}
                text="Профиль"
                indicator={<Badge mode="prominent" aria-label="Есть новые" />}
            >
                <Icon28UserSquareOutline />
            </TabbarItem>
        </Tabbar>
    );
});
