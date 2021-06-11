import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Event, EventOrder } from "../../types";
import { SoAPI } from "../../utils/api.service";

export class EventStore {
    eventData: Event | null = null;
    eventOrder: EventOrder | null = null;

    constructor() {
        makeAutoObservable(this);
    }
    setEvent(data: Event) {
        this.eventData = data;
    }
    reset() {
        this.eventData = null;
    }
    fetchEvent(id: string, onLoad: () => void) {
        SoAPI.getEvent(id).then(({ data }) => {
            this.setEvent(data);
            onLoad();
        });
    }
    toggleVisibility(id: number) {
        SoAPI.toggleEventVisibility(id).then(({ data }) => {
            this.setEvent(data);
        });
    }
    fetchOrder(id: number, onLoad: () => void) {
        SoAPI.getEventOrder(id).then(({ data }) => {
            this.setEventOrder(data);
            onLoad();
        });
    }
    setEventOrder(data: EventOrder) {
        this.eventOrder = data;
    }
    resetOrder() {
        this.eventOrder = null;
    }
}

export const EventStoreInstance = new EventStore();

export const eventStore = createContext(EventStoreInstance);
