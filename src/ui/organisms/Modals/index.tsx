import { ModalRoot as MRoot } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { BoecFilterModal } from "../../../features/boec/ui/modals/BoecFilterModal";
import { BoecListModal } from "../../../features/boec/ui/modals/BoecListModal";
import { BoecSelectModal } from "../../../features/boec/ui/modals/BoecSelectModal";
import { LeaderPositionModal } from "../../../features/boec/ui/modals/LeaderPositionModal";
import { BrigadeListModal } from "../../../features/brigades/ui/modals/BrigadeListModal";
import { BrigadeSelectModal } from "../../../features/brigades/ui/modals/BrigadeSelectModal";
import { NominationEditModal } from "../../../features/event/ui/modals/NominationEditModal";
import { NominationSelectModal } from "../../../features/event/ui/modals/NominationSelectModal";
import { ParticipantTitleModal } from "../../../features/event/ui/modals/ParticipantTitleModal";
import { TicketScanModal } from "../../../features/scanner/ui/organisms/modals/TicketScanModal";

import { routerStore } from "../../../features/stores/router-store";

export const Modals = observer(() => {
    const { activeModal, closeModal } = useContext(routerStore);

    return (
        <MRoot activeModal={activeModal} onClose={closeModal}>
            {BoecFilterModal()}
            {BoecListModal()}
            {LeaderPositionModal()}
            {BoecSelectModal()}
            {NominationSelectModal()}
            {NominationEditModal()}
            {BrigadeSelectModal()}
            {BrigadeListModal()}
            {ParticipantTitleModal()}
            {TicketScanModal()}
        </MRoot>
    );
});
