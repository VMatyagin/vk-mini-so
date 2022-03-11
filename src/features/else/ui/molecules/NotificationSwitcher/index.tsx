import { SimpleCell, Switch } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { appStore } from "../../../../stores/app-store";

export const NotificationSwitcher = observer(() => {
  const store = useContext(appStore);

  console.log(store.isNotificationsEnabled);

  return (
    <SimpleCell
      after={
        <Switch
          onChange={store.toggleNotifications}
          checked={store.isNotificationsEnabled}
        />
      }
    >
      Уведомления
    </SimpleCell>
  );
});
