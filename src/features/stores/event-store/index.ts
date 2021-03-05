import { cast, types } from "mobx-state-tree";

import { Event } from "../../types";
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
});
export const EventStore = types
    .model("EventStore", {
        eventData: types.maybeNull(EventModel),
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
    }));
