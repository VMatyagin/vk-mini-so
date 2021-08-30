import {
  Icon28Newsfeed,
  Icon28ScanViewfinderOutline,
  Icon28UserSquareOutline,
} from "@vkontakte/icons";
import { Badge, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { appStore } from "../../../features/stores/app-store";

export const MobileMenu = observer(() => {
  const { user } = useContext(appStore);

  return (
    <Tabbar itemsLayout="vertical" shadow={false}>
      <TabbarItem
        // onClick={() => history.push("/")}
        // selected={activeStory === "else"}
        text="Ещё"
      >
        <Icon28Newsfeed />
      </TabbarItem>
      <TabbarItem
        // onClick={() => history.push("/scanner")}
        // selected={activeStory === "scanner"}
        text="Сканнер"
      >
        <Icon28ScanViewfinderOutline />
      </TabbarItem>
      <TabbarItem
        // onClick={() => history.push("/profile")}
        // selected={activeStory === "profile"}
        text="Профиль"
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
