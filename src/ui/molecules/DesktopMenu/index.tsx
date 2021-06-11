import { Icon28Newsfeed } from "@vkontakte/icons";
import {
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
import { routerStore } from "../../../features/stores/router-store";

export const DesktopMenu = observer(() => {
    const platform = usePlatform();

    const hasHeader = platform !== VKCOM;
    const { activeStory, setStory } = useContext(routerStore);

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
                        onClick={() => setStory("else", "base")}
                        before={<Icon28Newsfeed />}
                    >
                        Ещё
                    </Cell>
                </Group>
            </Panel>
        </SplitCol>
    );
});
