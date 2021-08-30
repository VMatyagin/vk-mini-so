import { FC, useState } from "react";
import {
  Panel,
  PanelHeaderBack,
  Title,
  PanelProps,
  PanelHeader,
} from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { MainInfoForm } from "../ui/molecules/MainInfoForm";
import { PositionsForm } from "../ui/molecules/PositionsForm";

export const BrigadeEditPanel: FC<PanelProps> = observer((props) => {
  const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);
  const onSuccess = () => {
    setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Редактирование отряда
        </Title>
      </PanelHeader>

      <MainInfoForm onSuccess={onSuccess} />
      <PositionsForm />
      {SnackBar}
    </Panel>
  );
});
