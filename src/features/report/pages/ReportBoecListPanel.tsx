import { FC, useContext, useMemo, useRef } from "react";
import {
  CellButton,
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  ScreenSpinner,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { Boec, Season } from "../../types";
import { LazyList, LazyListControls } from "../../../ui/organisms/LazyList";
import { useRoute } from "react-router5";
import { ReportAPI } from "../../utils/requests/reports-requests";
import { SeasonCell } from "../ui/molecules/SeasonCell";
import { routerStore } from "../../stores/router-store";
import { MODAL_BOEC_LIST } from "../../boec/ui/modals/BoecListModal";
import { useMutation } from "react-query";

export const ReportBoecListPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const laztListRef = useRef<LazyListControls>(null);
  const { setModalCallback, closeModal, openModal, openPopout, closePopout } =
    useContext(routerStore);
  const { reportId } = useMemo(() => route.params, [route]);

  const { mutate } = useMutation(
    (formData: Partial<Season>) => {
      closeModal();
      openPopout(<ScreenSpinner />);
      return ReportAPI.createSeason(reportId, formData);
    },
    {
      onSuccess: () => {
        closePopout();
        laztListRef.current?.refetch();
      },
      onError: closePopout,
    }
  );
  const createNewPeople = () => {
    navigate("else.boecs.create", { reportId });
  };
  const openAllBoecListModal = () => {
    setModalCallback(MODAL_BOEC_LIST, async (boec: Boec) => {
      mutate({ boecId: boec.id, state: "rejected" });
      closeModal();
    });
    openModal(MODAL_BOEC_LIST);
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
        <CellButton onClick={createNewPeople}>
          Добавить нового человека
        </CellButton>
        <CellButton onClick={openAllBoecListModal}>
          Добавить существующего бойца
        </CellButton>
      </Group>
      <Group>
        <LazyList
          laztListRef={laztListRef}
          fetchFn={ReportAPI.getSeasonsList}
          queryKey={`brigade-${reportId}-seasons`}
          extraFnProp={{
            reportId,
          }}
          enabled={!!reportId}
          renderItem={(season) => (
            <SeasonCell key={season.id} season={season} />
          )}
        />
      </Group>
    </Panel>
  );
});
