import {
  Group,
  Panel,
  PanelHeader,
  SplitCol,
  usePlatform,
  VKCOM,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";

export const DesktopMenu = observer(() => {
  const platform = usePlatform();

  const hasHeader = platform !== VKCOM;

  return (
    <SplitCol fixed width="280px" maxWidth="280px">
      <Panel>
        {hasHeader && <PanelHeader />}
        <Group>
          {/* <Cell
                        disabled={activeStory === "else"}
                        style={
                            activeStory === "else"
                                ? {
                                      backgroundColor:
                                          "var(--button_secondary_background)",
                                      borderRadius: 8
                                  }
                                : {}
                        }
                        onClick={() => route.router.navigateToDefault()}
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
                                      borderRadius: 8
                                  }
                                : {}
                        }
                        onClick={() => route.router.navigate("profile")}
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
                    </Cell> */}
        </Group>
      </Panel>
    </SplitCol>
  );
});
