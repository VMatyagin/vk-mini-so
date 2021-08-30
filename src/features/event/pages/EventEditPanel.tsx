import { FC } from "react";
import { Panel, PanelHeaderBack, PanelProps, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { MainInfoForm } from "../ui/organisms/MainInfoForm";

export const EventEditPanel: FC<PanelProps> = observer((props) => {
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {/* {route.params.id ? "Редактирование" : "Новое мероприятие"} */}
        </Title>
      </PanelHeader>
      <MainInfoForm />
    </Panel>
  );
});
