import {
  Icon28CalendarOutline,
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
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useRouter } from "react-router5";
import { NotificationSwitcher } from "../ui/molecules/NotificationSwitcher";

export const ElsePanel: FC<PanelProps> = observer((props) => {
  // const { user } = useContext(appStore);
  const { navigate } = useRouter();
  return (
    <Panel {...props}>
      <PanelHeader>Ещё</PanelHeader>
      <NotificationSwitcher />
      <Group>
        <SimpleCell
          before={<Icon28CalendarOutline />}
          onClick={() => navigate("else.events.create")}
        >
          Создать мероприятие
        </SimpleCell>
        <SimpleCell
          before={<Icon28CalendarOutline />}
          onClick={() => navigate("else.events.base")}
        >
          Мероприятия
        </SimpleCell>
        <SimpleCell
          before={<Icon28UserSquareOutline />}
          onClick={() => navigate("else.brigades.base")}
        >
          Отряды
        </SimpleCell>
        <SimpleCell
          before={<Icon28UserSquareOutline />}
          onClick={() => navigate("else.shtabs.base")}
        >
          Штабы
        </SimpleCell>
        <SimpleCell
          before={<Icon28UserSquareOutline />}
          onClick={() => navigate("else.boecs.base")}
        >
          Поиск по бойцам
        </SimpleCell>

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
