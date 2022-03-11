import { FC, useMemo } from "react";
import {
  Panel,
  PanelHeaderBack,
  PanelProps,
  SimpleCell,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList } from "../../../ui/organisms/LazyList";
import { useRoute } from "react-router5";
import { Icon12Favorite } from "@vkontakte/icons";

export const BrigadeListPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { shtabId } = useMemo(() => route.params, [route]);

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
      <LazyList
        fetchFn={BrigadesAPI.getBrigadesList}
        queryKey={"brigade-list-sort"}
        extraFnProp={{ shtabId }}
        withSearch={true}
        pullToRefresh
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
    </Panel>
  );
});
