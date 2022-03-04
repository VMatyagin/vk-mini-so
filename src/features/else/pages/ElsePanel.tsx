import {
  Icon28CalendarOutline,
  Icon28HomeOutline,
  Icon28UsersOutline,
  // Icon28ChevronRightOutline,
  // Icon28HelpOutline,
  // Icon28MailOutline,
  // Icon28PollSquareOutline,
  // Icon28ScanViewfinderOutline,
  // Icon28UsersOutline,
  // Icon28StatisticsOutline,
  Icon28UserSquareOutline,
  // Icon28HelpOutline,
  // Icon28MailOutline,
  // Icon28PollSquareOutline,
  // Icon28ScanViewfinderOutline,
  // Icon28StatisticsOutline,
  // Icon28UsersOutline,
} from "@vkontakte/icons";
import {
  Group,
  Panel,
  PanelHeader,
  PanelProps,
  SimpleCell,
  Tooltip,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "react-router5";
import { appStore } from "../../stores/app-store";
import { storageGet, storageSet } from "../../VKBridge";
import { NotificationSwitcher } from "../ui/molecules/NotificationSwitcher";

export const ElsePanel: FC<PanelProps> = observer((props) => {
  const { user } = useContext(appStore);
  const [activeTooltip, setActiveTooltip] = useState(false);
  useEffect(() => {
    const checkKeys = async () => {
      const data = await storageGet("elseTooltip");

      if (data.keys?.[0].value !== "shown") {
        setActiveTooltip(true);
      }
    };
    checkKeys();
  }, []);

  const onTooltipClose = () => {
    storageSet("elseTooltip", "shown");
    setActiveTooltip(false);
  };
  const { navigate } = useRouter();
  return (
    <Panel {...props}>
      <PanelHeader>Ещё</PanelHeader>
      <NotificationSwitcher />
      <Group>
        <SimpleCell
          before={<Icon28CalendarOutline />}
          onClick={() => navigate("else.events.base")}
        >
          Ближайшие мероприятия
        </SimpleCell>
        <Tooltip
          isShown={activeTooltip}
          alignX="left"
          cornerAbsoluteOffset={20}
          text="Здесь можно посмотреть отряды и подать заявку на вступление"
          onClose={onTooltipClose}
        >
          <SimpleCell
            before={<Icon28UsersOutline />}
            onClick={() => navigate("else.brigades.base")}
          >
            Отряды
          </SimpleCell>
        </Tooltip>

        <SimpleCell
          before={<Icon28HomeOutline />}
          onClick={() => navigate("else.shtabs.base")}
        >
          Штабы
        </SimpleCell>
        {user?.isStaff && (
          <SimpleCell
            before={<Icon28UserSquareOutline />}
            onClick={() => navigate("else.boecs.base")}
          >
            Поиск по бойцам
          </SimpleCell>
        )}
        {/* <SimpleCell
          before={<Icon28ScanViewfinderOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Контроль билетов
        </SimpleCell>
        <SimpleCell
          before={<Icon28MailOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Приглашения
        </SimpleCell>
        <SimpleCell
          before={<Icon28PollSquareOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Голосования
        </SimpleCell>
        <SimpleCell
          before={<Icon28HelpOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Помощь
        </SimpleCell> */}
      </Group>
    </Panel>
  );
});
