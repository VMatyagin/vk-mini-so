import { Icon28Newsfeed } from "@vkontakte/icons";
import { Tabbar, TabbarItem } from "@vkontakte/vkui";
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
        </Tabbar>
    );
});
