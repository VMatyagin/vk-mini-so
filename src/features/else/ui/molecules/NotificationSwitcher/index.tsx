import { SimpleCell, Switch } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { appStore } from "../../../../stores/app-store";
import { allowNotifications, denyNotifications } from "../../../../VKBridge";

export const NotificationSwitcher = observer(() => {
  const { appParams } = useContext(appStore);
  const [checked, setChecked] = useState(
    appParams?.vk_are_notifications_enabled
  );
  useEffect(() => {
    if (appParams && appParams.vk_are_notifications_enabled) {
      setChecked(Number(appParams.vk_are_notifications_enabled) === 1);
    }
  }, [appParams]);
  const handleClick = () => {
    if (!checked) {
      allowNotifications().then((data) => {
        data.result === true && setChecked(true);
      });
    } else {
      denyNotifications().then((data) => {
        data.result === true && setChecked(false);
      });
    }
  };

  return (
    <SimpleCell
      after={<Switch onClick={handleClick} readOnly={true} checked={checked} />}
    >
      Уведомления
    </SimpleCell>
  );
});
