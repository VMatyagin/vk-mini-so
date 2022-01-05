import { FC } from "react";
import { Panel, PanelHeaderBack, Title, PanelProps } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { MainInfoForm } from "../ui/molecules/MainInfoForm";
import { PositionsForm } from "../../brigades/ui/molecules/PositionsForm";

export const ShtabEditPanel: FC<PanelProps> = observer((props) => {
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Редактирование штаба
        </Title>
      </PanelHeader>

      <MainInfoForm />
      <PositionsForm />
    </Panel>
  );
});
