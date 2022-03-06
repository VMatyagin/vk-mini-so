import { FC, useMemo } from "react";
import {
  CellButton,
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList } from "../../../ui/organisms/LazyList";
import { useRoute } from "react-router5";

export const BrigadeReportsListPanel: FC<PanelProps> = observer((props) => {
  const { route, router } = useRoute();
  const { brigadeId } = useMemo(() => route.params, [route]);
  const openReport = (reportId: number) => {
    router.navigate("else.report.details", { reportId });
  };
  const handleAdd = () => {
    router.navigate("else.reports.create", { brigadeId });
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Сезоны
        </Title>
      </PanelHeader>
      <Group>
        <CellButton onClick={handleAdd}>Добавить год</CellButton>
      </Group>
      <Group>
        <LazyList
          fetchFn={BrigadesAPI.getBrigadeReports}
          queryKey={`brigade-${brigadeId}-reports`}
          extraFnProp={{
            brigadeId,
          }}
          enabled={!!brigadeId}
          renderItem={(report) => (
            <SimpleCell
              key={report.id}
              onClick={() => openReport(report.id)}
              description={`${report.boecCount} чел.`}
            >
              {`${report.year} ${report.employer ?? ""}`}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
