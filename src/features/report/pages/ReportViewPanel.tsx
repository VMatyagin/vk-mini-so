import { FC, useContext, useMemo } from "react";
import {
  CellButton,
  Group,
  Header,
  Panel,
  PanelHeaderBack,
  PanelSpinner,
  SimpleCell,
  Title,
  PanelProps,
  InfoRow,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { useQuery } from "react-query";
import { useRoute } from "react-router5";
import { ReportAPI } from "../../utils/requests/reports-requests";
import { Icon28UsersOutline } from "@vkontakte/icons";
import { appStore } from "../../stores/app-store";

export const ReportViewPanel: FC<PanelProps> = observer((props) => {
  const { isStaff } = useContext(appStore);

  const {
    route,
    router: { navigate },
  } = useRoute();
  const { reportId } = useMemo(() => route.params, [route]);

  const { data: report, isLoading } = useQuery({
    queryKey: ["season-report", reportId],
    queryFn: ({ queryKey }) => ReportAPI.getReport(queryKey[1] as number),
    retry: 1,
    enabled: !!reportId,
    refetchOnWindowFocus: false,
  });

  const handleEdit = () => {
    navigate("else.report.edit", { reportId });
  };

  const handleOpenList = () => {
    navigate("else.report.boec-list", {
      reportId,
    });
  };

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Отчет за сезон
        </Title>
      </PanelHeader>
      {isLoading || !report ? (
        <PanelSpinner />
      ) : (
        <>
          <Group header={<Header mode="secondary">Информация о сезоне</Header>}>
            <SimpleCell>
              <InfoRow header="Отряд">{report.brigade.fullTitle}</InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Работодатель">
                {report.employer ?? "Не указан"}
              </InfoRow>
            </SimpleCell>
            <SimpleCell multiline>
              <InfoRow header="Год">{report?.year}</InfoRow>
            </SimpleCell>
            <SimpleCell>
              <InfoRow header="Численность">{report.boecCount}</InfoRow>
            </SimpleCell>
          </Group>
          <Group>
            <SimpleCell
              before={<Icon28UsersOutline />}
              expandable={true}
              onClick={handleOpenList}
            >
              Выезжавшие
            </SimpleCell>
          </Group>
          {(report?.canEdit || isStaff) && (
            <>
              <Group>
                <CellButton expandable={true} onClick={handleEdit}>
                  Редактировать
                </CellButton>
              </Group>
            </>
          )}
        </>
      )}
    </Panel>
  );
});
