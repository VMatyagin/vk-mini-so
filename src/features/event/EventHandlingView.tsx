import React, { FC } from "react";
import { AbstractView } from "../../ui/molecules/AbstractView";
import { EventEditPanel } from "./pages/EventEditPanel";
import { EventHandlePanel } from "./pages/EventHandlePanel";
import { EventOrders } from "./pages/EventOrders";
import { EventPagePanel } from "./pages/EventPagePanel";
import { EventUsers } from "./pages/EventUsers";
import { OrderPanel } from "./pages/OrderPanel";
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

            <EventOrders id='event_orders' />
            <OrderPanel id='event_order' />

        </AbstractView>
    );
};
