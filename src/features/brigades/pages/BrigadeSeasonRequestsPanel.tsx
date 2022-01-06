import { FC, useContext, useMemo, useRef } from "react";
import {
  ActionSheet,
  ActionSheetItem,
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  ScreenSpinner,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { LazyList, LazyListControls } from "../../../ui/organisms/LazyList";
import { useRoute } from "react-router5";
import { routerStore } from "../../stores/router-store";
import { SeasonReport } from "../../types";
import { Icon28CancelOutline } from "@vkontakte/icons";
import { useMutation } from "react-query";
import { MODAL_REPORT_SELECT } from "../ui/modals/ReportSelectModal";

export const BrigadeSeasonRequestsPanel: FC<PanelProps> = observer((props) => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { openPopout, closePopout, openModal, setModalCallback, closeModal } =
    useContext(routerStore);
  const laztListRef = useRef<LazyListControls>(null);
  const { brigadeId } = useMemo(() => route.params, [route]);

  const openMergeModal = (item: SeasonReport) => {
    navigate(route.name, { ...route.params, mergeReport: item });
    setModalCallback(
      MODAL_REPORT_SELECT,
      async ({ reportId }: { reportId: number | null }) => {
        try {
          openPopout(<ScreenSpinner />);
          if (reportId === null) {
            await BrigadesAPI.approveSeasonRequest({
              brigadeId,
              reportId: item.id,
            });
          } else {
            // TODO там есть ошибка, что боец уже есть в списке
            await BrigadesAPI.mergeSeasonRequest({
              brigadeId,
              reportId: item.id,
              targetId: reportId,
            });
          }
        } finally {
          closePopout();
          closeModal();
          laztListRef?.current?.refetch();
        }
      }
    );
    openModal(MODAL_REPORT_SELECT);
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: BrigadesAPI.rejectSeasonRequest,
    onMutate: () => {
      openPopout(<ScreenSpinner />);
    },
    onSuccess: () => {
      closePopout();
      laztListRef.current?.refetch();
    },
    onError: closePopout,
  });
  const handleOpenActionSheet = (toggleRef: Element, item: SeasonReport) => {
    openPopout(
      <ActionSheet
        onClose={closePopout}
        iosCloseItem={
          <ActionSheetItem autoclose mode="cancel">
            Отменить
          </ActionSheetItem>
        }
        toggleRef={toggleRef}
      >
        <ActionSheetItem onClick={() => openMergeModal(item)} autoclose>
          Выбрать уже существующий отчет
        </ActionSheetItem>
        <ActionSheetItem
          autoclose
          before={<Icon28CancelOutline />}
          mode="destructive"
          onClick={() => deleteMutation({ brigadeId, reportId: item.id })}
        >
          Отклонить
        </ActionSheetItem>
      </ActionSheet>
    );
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Заявки
        </Title>
      </PanelHeader>
      <Group>
        <LazyList
          laztListRef={laztListRef}
          fetchFn={BrigadesAPI.getBrigadeSeasonRequests}
          queryKey={`brigade-${brigadeId}-season-requests`}
          extraFnProp={{
            brigadeId,
          }}
          enabled={!!brigadeId}
          renderItem={(report) => (
            <SimpleCell
              key={report.id}
              onClick={(event) =>
                handleOpenActionSheet(event.currentTarget, report)
              }
              description={
                report.employer ? `Работодатель: ${report.employer}` : null
              }
              indicator={report.year}
            >
              {report?.seasons?.[0].boec?.fullName}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
