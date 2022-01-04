import { FC, useContext, useMemo } from "react";
import {
  CellButton,
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { Boec } from "../../types";
import { LazyList } from "../../../ui/organisms/LazyList";
import { useRoute } from "react-router5";
import { ReportAPI } from "../../utils/requests/reports-requests";
import { SeasonCell } from "../ui/molecules/SeasonCell";
import { routerStore } from "../../stores/router-store";
import { MODAL_BOEC_LIST } from "../../boec/ui/modals/BoecListModal";

export const ReportBoecListPanel: FC<PanelProps> = observer((props) => {
  const { route } = useRoute();
  const { setModalCallback, closeModal, openModal } = useContext(routerStore);
  const { reportId, brigadeId } = useMemo(() => route.params, [route]);

  const openBoecListModal = () => {
    setModalCallback(MODAL_BOEC_LIST, (boec: Boec) => {
      // setBoecs((prev) => {
      //     if (prev.includes(boec)) {
      //         return prev;
      //     } else {
      //         return [...prev, boec];
      //     }
      // });
      closeModal();
    });
    openModal(MODAL_BOEC_LIST, { brigadeId });
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Выезжавшие
        </Title>
      </PanelHeader>
      <Group>
        <CellButton>Добавить нового человека</CellButton>
        <CellButton onClick={openBoecListModal}>Добавить из бойцов</CellButton>
      </Group>
      <Group>
        <LazyList
          fetchFn={ReportAPI.getSeasonsList}
          queryKey={`brigade-${reportId}-seasons`}
          extraFnProp={{
            reportId,
          }}
          enabled={!!reportId}
          renderItem={(season) => (
            <SeasonCell key={season.id} reportId={reportId} season={season} />
          )}
        />
      </Group>
    </Panel>
  );
});
