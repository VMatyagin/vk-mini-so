import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  SimpleCell,
  useAdaptivity,
  ViewWidth,
} from "@vkontakte/vkui";
import { LazyList } from "../../../../ui/organisms/LazyList";
import { RouterStoreInstance } from "../../../stores/router-store";
import { BrigadesAPI } from "../../../utils/requests/brigades-request";

export const MODAL_BRIGADE_LIST = "MODAL_BRIGADE_LIST";

export const BrigadeListModal = () => {
  const { closeModal, modalCallback } = RouterStoreInstance;

  const onBoecListClose = () => {
    closeModal();
  };

  const { viewWidth = 100 } = useAdaptivity();
  const isMobile = viewWidth <= ViewWidth.MOBILE;

  return (
    <ModalPage
      id={MODAL_BRIGADE_LIST}
      settlingHeight={100}
      dynamicContentHeight={true}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={onBoecListClose} />}
        >
          Выбор отряда
        </ModalPageHeader>
      }
      onClose={onBoecListClose}
    >
      <LazyList
        withSearch
        title="Отряды"
        fetchFn={BrigadesAPI.getBrigadesList}
        queryKey={"brigade-list"}
        renderItem={(item) => (
          <SimpleCell
            key={item.id}
            onClick={() => {
              modalCallback[MODAL_BRIGADE_LIST](item);
            }}
          >
            {item.fullTitle}
          </SimpleCell>
        )}
      />
    </ModalPage>
  );
};
