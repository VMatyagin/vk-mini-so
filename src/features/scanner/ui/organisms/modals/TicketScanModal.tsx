import { ModalCard, Button, Avatar } from "@vkontakte/vkui";
import { AppStoreInstance } from "../../../../stores/app-store";
import { RouterStoreInstance } from "../../../../stores/router-store";

export const MODAL_TICKET_SCAN = "MODAL_TICKET_SCAN";

export const TicketScanModal = () => {
    const { closeModal, modalProps } = RouterStoreInstance;
    const { userData } = AppStoreInstance;

    return (
        <ModalCard
            id={MODAL_TICKET_SCAN}
            onClose={closeModal}
            icon={<Avatar src={userData?.photo_200} size={72} />}
            header="Содержание QR кода"
            subheader={JSON.stringify(modalProps)}
            actions={[
                <Button
                    key="copy"
                    size="l"
                    mode="secondary"
                    onClick={closeModal}
                >
                    Отменить сканирование
                </Button>,
            ]}
            actionsLayout="vertical"
        ></ModalCard>
    );
};
