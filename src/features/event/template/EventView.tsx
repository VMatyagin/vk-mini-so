import { FC } from "react";

import { observer } from "mobx-react-lite";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { ViewProps } from "../../types";
import { ParticipantsPanel } from "../pages/ParticipantsPanel";
import { CompetitionsListPanel } from "../pages/CompetitionsListPanel";
import { CompetitionViewPanel } from "../pages/CompetitionViewPanel";
import { CompetitionParticipantListPanel } from "../pages/CompetitionParticipantListPanel";
import { CompetitionEditPanel } from "../pages/CompetitionEditPanel";
import { NomiantionsListPanel } from "../pages/NomiantionsListPanel";
import { QuotasPanel } from "../pages/QuotasPanel";

export const EventView: FC<ViewProps> = observer(({ id }) => {
  return (
    <AbstractView id={id}>
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
