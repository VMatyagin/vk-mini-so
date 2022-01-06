import { FC, useMemo } from "react";
import {
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  Title,
  PanelProps,
  SimpleCell,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { Shtab } from "../../types";
import { useQuery } from "react-query";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { useRoute } from "react-router5";
import { Icon28CalendarOutline, Icon28UsersOutline } from "@vkontakte/icons";
import { ShtabOrBrigadeLeaders } from "../../brigades/ui/molecules/ShtabOrBrigadeLeaders";

export const ShtabViewPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { shtabId } = useMemo(() => route.params, [route]);

  const openEdit = () => {
    navigate("else.shtab.edit", { shtabId });
  };
  const { data: shtabInfo } = useQuery<Shtab>({
    queryKey: ["shtab", shtabId],
    queryFn: ({ queryKey }) => {
      return ShtabsAPI.getShtab(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!shtabId,
  });

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {shtabInfo?.title}
        </Title>
      </PanelHeader>
      <Group header={<Header mode="secondary">Командный состав</Header>}>
        <ShtabOrBrigadeLeaders />
      </Group>

      <Group>
        {shtabInfo?.canEdit && (
          <SimpleCell
            before={<Icon28CalendarOutline />}
            onClick={() => navigate("else.events.create")}
          >
            Создать мероприятие
          </SimpleCell>
        )}
        <SimpleCell
          before={<Icon28UsersOutline />}
          onClick={() => navigate("else.brigades.base", { shtabId })}
        >
          Отряды
        </SimpleCell>
        {shtabInfo?.canEdit && (
          <SimpleCell onClick={openEdit}>Редактировать</SimpleCell>
        )}
      </Group>
    </Panel>
  );
});
