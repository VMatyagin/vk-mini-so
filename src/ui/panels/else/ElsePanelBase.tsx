import React, { FC, useState } from "react";
import { PanelTemplate } from "../template/PanelTemplate";
import {
  PanelHeader,
  Title,
  Group,
  SimpleCell,
  Avatar,
  Switch,
  Div,
} from "@vkontakte/vkui";
import { useMst } from "../../../feature/stores";
import { observer } from "mobx-react";
import Icon28ChevronRightOutline from "@vkontakte/icons/dist/28/chevron_right_outline";
import Icon28CalendarOutline from "@vkontakte/icons/dist/28/calendar_outline";
import Icon24ScanViewfinderOutline from "@vkontakte/icons/dist/24/scan_viewfinder_outline";
import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28StatisticsOutline from "@vkontakte/icons/dist/28/statistics_outline";
import Icon28HelpOutline from "@vkontakte/icons/dist/28/help_outline";
import Icon28MailOutline from "@vkontakte/icons/dist/28/mail_outline";
import Icon28PollSquareOutline from "@vkontakte/icons/dist/28/poll_square_outline";

export const ElsePanelBase: FC<{ id: string }> = observer(({ id }) => {
  const store = useMst();
  const [checked, setChecked] = useState(false);
  const handleClick = () => setChecked(!checked);
  const changeView = (view: string) => {
    store.router.setPage(view, "base");
  };

  return (
    <PanelTemplate id={id}>
      <PanelHeader>
        <Title level="2" weight="bold">
          Ещё
        </Title>
      </PanelHeader>
      <Group>
        <SimpleCell
          before={<Avatar size={72} src={store.app.userData.photo} />}
          description={store.app.soData.position}
        >
          {`${store.app.userData.first_name} ${store.app.userData.last_name}`}
        </SimpleCell>
      </Group>
      <Group
        description="Уведомления о предстоящих мероприятиях и всем, что связано с ними"
        separator="show"
      >
        <SimpleCell after={<Switch onChange={handleClick} checked={checked} />}>
          Уведомления
        </SimpleCell>
      </Group>
      <Group>
        <SimpleCell
          before={<Icon28CalendarOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
          onClick={() => changeView("else_event_handle")}
        >
          Управление мероприятиями
        </SimpleCell>
        <SimpleCell
          before={<Icon24ScanViewfinderOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Контроль билетов
        </SimpleCell>
        <SimpleCell
          before={<Icon28UsersOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Мой отряд / штаб
        </SimpleCell>
        <SimpleCell
          before={<Icon28StatisticsOutline />}
          after={<Icon28ChevronRightOutline fill="var(--icon_tertiary)" />}
        >
          Рейтинг
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
        </SimpleCell>
      </Group>
      <Div />
    </PanelTemplate>
  );
});
