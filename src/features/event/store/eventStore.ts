import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class EventStore {
    eventId: number | null = null;
    competitionId: number | null = null;
    nominationId: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }
    setEventId = (id: number | null) => {
        this.eventId = id;
    };
    setCompetitionId = (id: number | null) => {
        this.competitionId = id;
    };
    setNominationId = (id: number | null) => {
        this.nominationId = id;
    };
}

export const EventStoreInstance = new EventStore();

export const eventStore = createContext(EventStoreInstance);
