import { FC, useMemo } from "react";
import { Panel, PanelHeaderBack, Title, PanelProps } from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { CompetitionMainInfoForm } from "../ui/organisms/CompetitionMainInfoForm";
import { useRoute } from "react-router5";

export const CompetitionEditPanel: FC<PanelProps> = observer((props) => {
  const { route } = useRoute();
  const competitionId = useMemo(() => route.params.competitionId, [route]);
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          {competitionId ? "Редактирование" : "Новый конкурс"}
        </Title>
      </PanelHeader>
      <CompetitionMainInfoForm />
    </Panel>
  );
});
