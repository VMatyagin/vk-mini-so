import { Icon28Newsfeed, Icon28UserSquareOutline } from "@vkontakte/icons";
import {
    Badge,
    Cell,
    Group,
    Panel,
    PanelHeader,
    SplitCol,
    usePlatform,
    VKCOM,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { appStore } from "../../../features/stores/app-store";
import { routerStore } from "../../../features/stores/router-store";

export const DesktopMenu = observer(() => {
    const platform = usePlatform();

    const hasHeader = platform !== VKCOM;
    const { activeStory, setStory } = useContext(routerStore);
    const { user } = useContext(appStore);

    return (
        <SplitCol fixed width="280px" maxWidth="280px">
            <Panel>
                {hasHeader && <PanelHeader />}
                <Group>
                    <Cell
                        disabled={activeStory === "else"}
                        style={
                            activeStory === "else"
                                ? {
                                      backgroundColor:
                                          "var(--button_secondary_background)",
                                      borderRadius: 8,
                                  }
                                : {}
                        }
                        onClick={() => setStory("else", "base", "else")}
                        before={<Icon28Newsfeed />}
                        id="base"
                    >
                        Ещё
                    </Cell>
                    <Cell
                        disabled={activeStory === "profile"}
                        style={
                            activeStory === "profile"
                                ? {
                                      backgroundColor:
                                          "var(--button_secondary_background)",
                                      borderRadius: 8,
                                  }
                                : {}
                        }
                        onClick={() => setStory("profile", "base", "profile")}
                        before={<Icon28UserSquareOutline />}
                        id="profile"
                        badge={
                            user?.unreadActivityCount! > 0 && (
                                <Badge
                                    mode="prominent"
                                    aria-label="Есть новые"
                                />
                            )
                        }
                    >
                        Профиль
                    </Cell>
                </Group>
            </Panel>
        </SplitCol>
    );
});
