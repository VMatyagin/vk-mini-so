import {
  CellButton,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  SimpleCell,
  useAdaptivity,
  ViewWidth,
} from "@vkontakte/vkui";
import { useMemo } from "react";
import { useRoute } from "react-router5";
import { LazyList } from "../../../../ui/organisms/LazyList";
import { RouterStoreInstance } from "../../../stores/router-store";
import { BrigadesAPI } from "../../../utils/requests/brigades-request";

export const MODAL_REPORT_SELECT = "MODAL_REPORT_SELECT";

export const ReportSelectModal = () => {
  const { closeModal, modalCallback } = RouterStoreInstance;
  const { route } = useRoute();
  const { brigadeId } = useMemo(() => route.params, [route]);

  const { viewWidth = 100 } = useAdaptivity();
  const isMobile = viewWidth <= ViewWidth.MOBILE;

  return (
    <ModalPage
      id={MODAL_REPORT_SELECT}
      settlingHeight={100}
      dynamicContentHeight={true}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={closeModal} />}
        >
          Выбор отчета
        </ModalPageHeader>
      }
      onClose={closeModal}
    >
      <Group>
        <CellButton
          onClick={() =>
            modalCallback?.[MODAL_REPORT_SELECT]?.({
              reportId: null,
            })
          }
        >
          Создать новый на основе заявки
        </CellButton>
      </Group>
      <Group header={<Header>Существующие отчеты</Header>}>
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
              onClick={() =>
                modalCallback?.[MODAL_REPORT_SELECT]?.({
                  reportId: report.id,
                })
              }
              description={`${report.boecCount} чел.`}
            >
              {`${report.year} ${report.employer ?? ""}`}
            </SimpleCell>
          )}
        />
      </Group>
    </ModalPage>
  );
};
