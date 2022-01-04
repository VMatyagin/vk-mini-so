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

// const sortByFirstSeason = (seasons: Season[]) => {
//     let usedUsers = new Set();
//     return Object.entries(
//         seasons
//             .sort((a, b) => a.year - b.year)
//             .reduce((prev, current) => {
//                 if (usedUsers.has(toJS(current.boec.id))) {
//                     return prev;
//                 }
//                 usedUsers.add(toJS(current.boec.id));

//                 return {
//                     ...prev,
//                     [current.year]: [
//                         ...(prev[current.year] || []),
//                         current.boec,
//                     ],
//                 };
//             }, {} as Record<string, Boec[]>)
//     );
// };

// const sortByYear = (seasons: Season[]) => {
//     return Object.entries(
//         seasons
//             .sort((a, b) => a.year - b.year)
//             .reduce(
//                 (prev, current) => ({
//                     ...prev,
//                     [current.year]: [
//                         ...(prev[current.year] || []),
//                         current.boec,
//                     ],
//                 }),
//                 {} as Record<string, Boec[]>
//             )
//     );
// };

export const BrigadeReportsListPanel: FC<PanelProps> = observer((props) => {
  const { route, router } = useRoute();
  const { brigadeId } = useMemo(() => route.params, [route]);
  const openReport = (reportId: number) => {
    router.navigate("else.report.details", { reportId });
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
        <CellButton>Добавить год</CellButton>
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
              {report.year}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
