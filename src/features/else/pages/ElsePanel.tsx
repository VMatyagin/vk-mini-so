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
  PanelSpinner,
  SimpleCell,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { appStore } from "../../stores/app-store";
import { NotificationSwitcher } from "../ui/molecules/NotificationSwitcher";
// import { SubjectSelectingCell } from "../ui/molecules/SubjectSelectingCell";

export const ElsePanel: FC<PanelProps> = observer((props) => {
  const { user } = useContext(appStore);
  // const { push } = useHistory();
  return (
    <Panel {...props}>
      <PanelHeader>Ещё</PanelHeader>
      <NotificationSwitcher />
      <Group>
        {!user && <PanelSpinner />}
        {((user !== null && user.shtabs.length > 0) || user?.isStaff) && (
          <>
            <SimpleCell
              before={<Icon28CalendarOutline />}
              // onClick={() => push("/event/create")}
            >
              Создать мероприятие
            </SimpleCell>
            <SimpleCell
              before={<Icon28UserSquareOutline />}
              // onClick={() => push("/brigade")}
            >
              Отряды
            </SimpleCell>
            <SimpleCell
              before={<Icon28UserSquareOutline />}
              // onClick={() => push("/boec")}
            >
              Поиск по бойцам
            </SimpleCell>
          </>
        )}
        {/* {user && (user.brigades.length !== 0 || user.shtabs.length !== 0) && (
          <SubjectSelectingCell
            onBrigadeClick={(brigadeId) => push(`/brigade/${brigadeId}`)}
            onShtabClick={(shtabId) => push(`/shtab/${shtabId}`)}
          >
            {({ handleClick, ref }) => (
              <SimpleCell
                getRootRef={ref}
                onClick={handleClick}
                before={<Icon28UsersOutline />}
              >
                Мой коллектив
              </SimpleCell>
            )}
          </SubjectSelectingCell>
        )} */}
        {user && user.isStaff && (
          <SimpleCell
            before={<Icon28UserSquareOutline />}
            // onClick={() => push("/shtab")}
          >
            Штабы
          </SimpleCell>
        )}
        <SimpleCell
          before={<Icon28CalendarOutline />}
          // onClick={() => push("/event")}
        >
          Мероприятия
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
