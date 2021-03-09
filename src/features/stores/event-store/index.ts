import { cast, types } from "mobx-state-tree";

import { Event, EventOrder } from "../../types";
import { SoAPI } from "../../utils/api.service";

const BoecShort = types.model({
    id: types.number,
    fullName: types.string,
});

const EventModel = types.model({
    id: types.number,
    status: types.number,
    title: types.string,
    description: types.maybeNull(types.string),
    location: types.maybeNull(types.string),
    shtab: types.maybeNull(types.number),
    startDate: types.maybeNull(types.string),
    startTime: types.maybeNull(types.string),
    end: types.maybeNull(types.string),
    organizer: types.array(BoecShort),
    volonteer: types.array(BoecShort),
    visibility: types.boolean,
    worth: types.string,
});

const EventOrderModel = types.model({
    id: types.number,
    brigades: types.array(
        types.model({
            id: types.number,
            title: types.string,
        })
    ),
    participations: types.array(BoecShort),
    event: types.number,
    isСontender: types.boolean,
    place: types.maybeNull(types.string),
    title: types.string,
});
export const EventStore = types
    .model("EventStore", {
        eventData: types.maybeNull(EventModel),
        eventOrder: types.maybeNull(EventOrderModel),
    })
    .actions((self) => ({
        setEvent(data: Event) {
            self.eventData = cast(data);
        },
        reset() {
            self.eventData = null;
        },
        fetchEvent(id: string, onLoad: () => void) {
            SoAPI.getEvent(id).then(({ data }) => {
                this.setEvent(data);
                onLoad();
            });
        },
        toggleVisibility(id: number) {
            SoAPI.toggleEventVisibility(id).then(({ data }) => {
                this.setEvent(data);
            });
        },
        fetchOrder(id: number, onLoad: () => void) {
            SoAPI.getEventOrder(id).then(({ data }) => {
                this.setEventOrder(data);
                onLoad();
            });
        },
        setEventOrder(data: EventOrder) {
            self.eventOrder = cast(data);
        },
        resetOrder() {
            self.eventOrder = null;
        },
    }));
