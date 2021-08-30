import {
  Icon28Newsfeed,
  Icon28ScanViewfinderOutline,
  Icon28UserSquareOutline,
} from "@vkontakte/icons";
import { Badge, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext, useMemo } from "react";
import { useRoute, useRouter } from "react-router5";

import { appStore } from "../../../features/stores/app-store";

export const MobileMenu = observer(() => {
  const { user } = useContext(appStore);
  const { route } = useRoute();
  const { navigate, navigateToDefault } = useRouter();
  const location = useMemo(() => route.name.split("."), [route.name]);
  return (
    <Tabbar itemsLayout="vertical" shadow={false}>
      <TabbarItem
        onClick={() => navigateToDefault()}
        selected={location[0] === "else"}
        // text="Ещё"
      >
        <Icon28Newsfeed />
      </TabbarItem>
      <TabbarItem
        onClick={() => navigate("scanner")}
        selected={location[0] === "scanner"}
        // text="Сканнер"
      >
        <Icon28ScanViewfinderOutline />
      </TabbarItem>
      <TabbarItem
        onClick={() => navigate("profile")}
        selected={location[0] === "profile"}
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
