import { FC } from "react";
import { Panel, PanelHeaderBack, PanelProps, Title } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { MainInfoForm } from "../ui/organisms/MainInfoForm";
import { useRoute } from "react-router5";

export const EventEditPanel: FC<PanelProps> = observer((props) => {
  const { route } = useRoute();

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {route.params.eventId ? "Редактирование" : "Новое мероприятие"}
        </Title>
      </PanelHeader>
      <MainInfoForm />
    </Panel>
  );
});
