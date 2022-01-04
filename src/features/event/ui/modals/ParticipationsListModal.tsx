import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  PanelSpinner,
  SimpleCell,
  useAdaptivity,
  ViewWidth,
} from "@vkontakte/vkui";
import { useQuery } from "react-query";
import { RouterStoreInstance } from "../../../stores/router-store";
import { EventAPI } from "../../../utils/requests/event-request";

export const MODAL_PARTICIPATION_LIST = "MODAL_PARTICIPATION_LIST";

interface ModalDataType {
  competitionId: number;
  participantId: number;
}
export const ParticipationsListModal = () => {
  const { closeModal, modalProps } = RouterStoreInstance;

  const onBoecListClose = () => {
    closeModal();
  };
  const { data } = useQuery({
    queryKey: ["competition-participant", modalProps],
    queryFn: ({ queryKey }) => {
      return EventAPI.getCompetitionParticipant(queryKey[1] as ModalDataType);
    },
    enabled: !!(modalProps as any)?.participantId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { viewWidth = 100 } = useAdaptivity();
  const isMobile = viewWidth <= ViewWidth.MOBILE;

  return (
    <ModalPage
      id={MODAL_PARTICIPATION_LIST}
      settlingHeight={100}
      dynamicContentHeight={true}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={onBoecListClose} />}
        >
          Список участников
        </ModalPageHeader>
      }
      onClose={onBoecListClose}
    >
      {!data && <PanelSpinner />}
      {data?.boec.map((boec) => (
        <SimpleCell key={boec.id}>{boec.fullName}</SimpleCell>
      ))}
    </ModalPage>
  );
};
