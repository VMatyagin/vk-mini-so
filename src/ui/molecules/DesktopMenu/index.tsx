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
import { useContext, useMemo } from "react";
import { useRoute } from "react-router5";
import { appStore } from "../../../features/stores/app-store";

export const DesktopMenu = observer(() => {
  const platform = usePlatform();
  const { user } = useContext(appStore);
  const hasHeader = platform !== VKCOM;
  const { route, router } = useRoute();

  const activeStory = useMemo(() => route.name.split(".")[0], [route]);

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
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8,
                  }
                : {}
            }
            onClick={() => router.navigateToDefault()}
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
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8,
                  }
                : {}
            }
            onClick={() => router.navigate("profile")}
            before={<Icon28UserSquareOutline />}
            id="profile"
            badge={
              (user?.unreadActivityCount ?? 0) > 0 && (
                <Badge mode="prominent" aria-label="Есть новые" />
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
