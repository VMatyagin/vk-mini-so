import { FC } from "react";
import {
  Panel,
  PanelHeaderBack,
  Title,
  PanelProps,
  PanelHeader,
} from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { UserEditMain } from "../ui/molecules/UserEditMain";
import { UserEditSeasons } from "../ui/molecules/UserEditSeasons";

export const BoecEditPanel: FC<PanelProps> = observer((props) => {
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Боец
        </Title>
      </PanelHeader>
      <UserEditMain />
      <UserEditSeasons />
    </Panel>
  );
});
