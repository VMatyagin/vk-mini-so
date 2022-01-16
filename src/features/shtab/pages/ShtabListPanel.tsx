import { FC } from "react";
import {
  Panel,
  PanelHeaderBack,
  SimpleCell,
  PanelProps,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { ShtabsAPI } from "../../utils/requests/shtab-request";
import { useRouter } from "react-router5";
import { LazyList } from "../../../ui/organisms/LazyList";
import { Icon12Favorite } from "@vkontakte/icons";

export const ShtabListPanel: FC<PanelProps> = observer((props) => {
  const { navigate } = useRouter();

  const handleSelect = (shtabId: number) => {
    navigate("else.shtab.details", { shtabId });
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Штабы
        </Title>
      </PanelHeader>
      <LazyList
        fetchFn={ShtabsAPI.getShtabs}
        queryKey={"shtab-list"}
        withSearch={true}
        renderItem={(shtab) => (
          <SimpleCell
            key={shtab.id}
            expandable={true}
            onClick={() => handleSelect(shtab.id)}
            badge={shtab.canEdit ? <Icon12Favorite /> : null}
          >
            {shtab.title}
          </SimpleCell>
        )}
      />
    </Panel>
  );
});
