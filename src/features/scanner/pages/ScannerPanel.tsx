import { FC } from "react";
import { Group, Panel, PanelProps, SimpleCell, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { LazyList } from "../../../ui/organisms/LazyList";
import { TicketsAPI } from "../../utils/requests/event-request";

export const ScannerPanel: FC<PanelProps> = observer((props) => {
  const goScan = () => {};

  return (
    <Panel {...props}>
      <PanelHeader>
        <Title level="2" weight="bold">
          Сканер
        </Title>
      </PanelHeader>
      <Group>
        <SimpleCell onClick={goScan} expandable={true}>
          Начать сканирование
        </SimpleCell>
      </Group>
      <Group>
        <LazyList
          title="Последние отсканированные билеты"
          fetchFn={TicketsAPI.getLastScans}
          queryKey={"scans-list"}
          emptyMessage={"Никто еще сканировал"}
          renderItem={(item) => (
            <SimpleCell key={item.id}>{item.ticket?.id}</SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
