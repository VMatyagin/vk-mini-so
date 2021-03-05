import React, { FC } from "react";
import { AbstractView } from "../../ui/molecules/AbstractView";
import { EventEditPanel } from "./pages/EventEditPanel";
import { EventHandlePanel } from "./pages/EventHandlePanel";
import { EventPagePanel } from "./pages/EventPagePanel";
import { EventUsers } from "./pages/EventUsers";
import { EventWinners } from "./pages/EventWinners";
import { SearchPanel } from "./pages/SearchPanel";
import { WalletPanel } from "./pages/WalletPanel";

export const EventHandlingView: FC<{ id: string }> = ({ id }) => {
    return (
        <AbstractView id={id}>
            <EventHandlePanel id="base" />
            <SearchPanel id="event_search" />

            <EventPagePanel id="event_page" />
            <EventEditPanel id="event_edit" />

            <WalletPanel id="event_page_wallets" />

            <EventUsers id="event_organizers" type="organizers" />
            <EventUsers id="event_volonteers" type="volonteers" />
            <EventUsers id="event_page_artists" type="artists" />

            <EventWinners id="event_page_winners" />
        </AbstractView>
    );
};
