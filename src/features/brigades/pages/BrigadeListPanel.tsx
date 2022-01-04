import { FC } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList } from "../../../ui/organisms/LazyList";
import { useRouter } from "react-router5";
import { Icon12Favorite } from "@vkontakte/icons";

export const BrigadeListPanel: FC<PanelProps> = observer((props) => {
  const { navigate } = useRouter();

  const selectBrigade = (brigadeId: number) => {
    navigate("else.brigade.details", { brigadeId });
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Отряды
        </Title>
      </PanelHeader>
      <Group>
        <LazyList
          fetchFn={BrigadesAPI.getBrigadesList}
          queryKey={"brigade-list-sort"}
          withSearch={true}
          renderItem={(brigade) => (
            <SimpleCell
              key={brigade.id}
              onClick={() => selectBrigade(brigade.id)}
              badge={brigade.canEdit ? <Icon12Favorite /> : null}
            >
              {brigade.fullTitle}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
