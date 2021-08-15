import { FC } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ViewProps } from "../../types";
import { BasePanel } from "../../else/pages/BasePanel";
import { EditPanel } from "../pages/EditPanel";
import { ListPanel } from "../pages/ListPanel";
import { ViewPanel } from "../pages/ViewPanel";
import { ParticipantsPanel } from "../pages/ParticipantsPanel";
import { CompetitionsListPanel } from "../pages/CompetitionsListPanel";
import { CompetitionViewPanel } from "../pages/CompetitionViewPanel";
import { CompetitionParticipantListPanel } from "../pages/CompetitionParticipantListPanel";
import { CompetitionEditPanel } from "../pages/CompetitionEditPanel";
import { NomiantionsListPanel } from "../pages/NomiantionsListPanel";
import { BrigadeParticipantsPanel } from "../pages/BrigadeParticipantsPanel";
import { QuotasPanel } from "../pages/QuotasPanel";

export const EventView: FC<ViewProps> = observer(({ id }) => {
    return (
        <AbstractView id={id}>
            <BasePanel id="base" viewId={id} />
            <EditPanel id="edit" viewId={id} />
            <ListPanel id="list" viewId={id} />
            <ViewPanel id="details" viewId={id} />

            <BrigadeParticipantsPanel id="brigade-participant" viewId={id} />
            <ParticipantsPanel id="volonteers" worth={1} viewId={id} />
            <ParticipantsPanel id="organizers" worth={2} viewId={id} />
            <ParticipantsPanel id="participant" worth={0} viewId={id} />

            <QuotasPanel id="quotas" viewId={id} />

            <CompetitionsListPanel id="competition-list" viewId={id} />
            <CompetitionViewPanel id="competition-details" viewId={id} />
            <CompetitionEditPanel id="competition-edit" viewId={id} />

            <CompetitionParticipantListPanel
                id="competition-participant-0"
                worth={0}
                viewId={id}
            />
            <CompetitionParticipantListPanel
                id="competition-participant-1"
                worth={1}
                viewId={id}
            />
            <CompetitionParticipantListPanel
                id="competition-participant-2"
                worth={2}
                viewId={id}
            />
            <CompetitionParticipantListPanel
                id="competition-participant-3"
                worth={3}
                viewId={id}
            />

            <NomiantionsListPanel id="nominations-list" viewId={id} />
        </AbstractView>
    );
});
