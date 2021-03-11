import { ModalRoot } from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React, { FC } from "react";
import { AbstractView } from "../../ui/molecules/AbstractView";
import { useMst } from "../stores";
import { UsersFilterModal } from "../users/molecules/modals/UsersFilterModal";
import { EventEditPanel } from "./pages/EventEditPanel";
import { EventHandlePanel } from "./pages/EventHandlePanel";
import { EventOrders } from "./pages/EventOrders";
import { EventPagePanel } from "./pages/EventPagePanel";
import { EventUsers } from "./pages/EventUsers";
import { FindUsersPanel } from "./pages/FindUsersPanel";
import { OrderPanel } from "./pages/OrderPanel";
import { SearchPanel } from "./pages/SearchPanel";
import { WalletPanel } from "./pages/WalletPanel";

export const EventHandlingView: FC<{ id: string }> = observer(({ id }) => {
    const store = useMst();

    let activeModal =
        store.router.activeModals[id] === undefined
            ? null
            : store.router.activeModals[id];
    const modals = (
        <ModalRoot activeModal={activeModal} onClose={store.router.closeModal}>
            <UsersFilterModal id="MODAL_USERS_LIST" />
        </ModalRoot>
    );
    return (
        <AbstractView id={id} modal={modals}>
            <EventHandlePanel id="base" />
            <SearchPanel id="event_search" />

            <EventPagePanel id="event_page" />
            <EventEditPanel id="event_edit" />

            <WalletPanel id="event_page_wallets" />

            <EventUsers id="event_organizers" type="organizers" />
            <EventUsers id="event_volonteers" type="volonteers" />

            <FindUsersPanel id="event_find_volonteers" type="volonteers" />
            <FindUsersPanel id="event_find_organizers" type="organizers" />

            <EventOrders id="event_orders" />
            <OrderPanel id="event_order" />
        </AbstractView>
    );
});
