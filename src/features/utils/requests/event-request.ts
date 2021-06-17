import axios, { Canceler } from "axios";
import {
    Competition,
    CompetitionParticipant,
    EventType,
    Nomination,
    Participant,
} from "../../types";
import { get, patch, post, remove } from "../axiosConfig";
import { ListResponse } from "../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const EventAPI = {
    async getEvent(id: number): Promise<EventType> {
        const { data } = await get(`/api/event/${id}/`);
        return data;
    },
    async createEvent(event: EventType): Promise<EventType> {
        const { data } = await post(`/api/event/`, event);
        return data;
    },
    async updateEvent(event: EventType): Promise<EventType> {
        const { data } = await patch(`/api/event/${event.id}/`, event);
        return data;
    },
    async getEventList({
        limit,
        offset,
        search,
    }: {
        offset: number;
        limit: number;
        search?: string;
    }): Promise<ListResponse<EventType>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            search,
        };

        const { data } = await get("/api/event/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
        return data;
    },
    async getEventParticipants({
        limit,
        offset,
        eventId,
        worth,
    }: {
        offset: number;
        eventId: number;
        limit: number;
        worth: Participant["worth"];
    }): Promise<ListResponse<Participant>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            worth,
        };

        const { data } = await get(`/api/event/${eventId}/participants/`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
        return data;
    },
    async setParticipant({
        boecId,
        eventId,
        worth,
    }: {
        boecId: number;
        eventId: number;
        worth: Participant["worth"];
    }): Promise<Participant> {
        const { data } = await post(`/api/event/${eventId}/participants/`, {
            boecId,
            worth,
        });
        return data;
    },
    async removeParticipant({
        participantId,
        eventId,
    }: {
        participantId: number;
        eventId: number;
    }): Promise<Participant> {
        const { data } = await remove(
            `/api/event/${eventId}/participants/${participantId}/`
        );
        return data;
    },
    async getEventCompetitions({
        limit,
        offset,
        eventId,
    }: {
        offset: number;
        eventId: number;
        limit: number;
    }): Promise<ListResponse<Competition>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
        };

        const { data } = await get(`/api/event/${eventId}/competitions/`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
        return data;
    },
    async getCompetition(id: number): Promise<Competition> {
        const { data } = await get(`/api/competition/${id}/`);
        return data;
    },

    async getCompetitionParicipants({
        limit,
        offset,
        competitionId,
        worth,
    }: {
        offset: number;
        competitionId: number;
        limit: number;
        worth: CompetitionParticipant["worth"];
    }): Promise<ListResponse<CompetitionParticipant>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            worth,
        };

        const { data } = await get(
            `/api/competition/${competitionId}/participants/`,
            {
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                }),
                params,
            }
        );
        return data;
    },
    async removeCompetitionParticipant({
        competitionId,
        participantId,
    }: {
        participantId: number;
        competitionId: number;
    }): Promise<CompetitionParticipant> {
        const { data } = await remove(
            `/api/competition/${competitionId}/participants/${participantId}/`
        );
        return data;
    },
    async createCompetitionParticipant({
        competitionId,
        boec,
    }: {
        boec: number[];
        competitionId: number;
    }): Promise<CompetitionParticipant> {
        const { data } = await post(
            `/api/competition/${competitionId}/participants/`,
            {
                boec,
            }
        );
        return data;
    },
    async updateCompetitionParticipant({
        competitionId,
        participantId,
        participant,
    }: {
        participantId: number;
        competitionId: number;
        participant: Partial<CompetitionParticipant>;
    }): Promise<CompetitionParticipant> {
        const { data } = await patch(
            `/api/competition/${competitionId}/participants/${participantId}/`,
            participant
        );
        return data;
    },
    async getCompetitionNominations({
        limit,
        offset,
        competitionId,
    }: {
        offset: number;
        competitionId: number;
        limit: number;
    }): Promise<ListResponse<CompetitionParticipant>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
        };

        const { data } = await get(
            `/api/competition/${competitionId}/nominations/`,
            {
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                }),
                params,
            }
        );
        return data;
    },
    async updateCompetitionNomination({
        competitionId,
        nomination,
    }: {
        competitionId: number;
        nomination: Nomination;
    }): Promise<Nomination> {
        const { data } = await patch(
            `/api/competition/${competitionId}/nominations/${nomination.id}/`,
            nomination
        );
        return data;
    },
    async updateCompetition({
        competition,
    }: {
        competition: Competition;
    }): Promise<Competition> {
        const { id, ...rest } = competition;
        const { data } = await patch(`/api/competition/${id}/`, rest);
        return data;
    },
    async createCompetition({
        competition,
        eventId,
    }: {
        competition: Competition;
        eventId: number;
    }): Promise<Competition> {
        const { data } = await post(
            `/api/event/${eventId}/competitions/`,
            competition
        );
        return data;
    },
    async removeCompetitionNomination({
        competitionId,
        nominationId,
    }: {
        nominationId: number;
        competitionId: number;
    }): Promise<Nomination> {
        const { data } = await remove(
            `/api/competition/${competitionId}/nominations/${nominationId}/`
        );
        return data;
    },
    async getCompetitionNomination({
        competitionId,
        nominationId,
    }: {
        nominationId: number;
        competitionId: number;
    }): Promise<Nomination> {
        const { data } = await get(
            `/api/competition/${competitionId}/nominations/${nominationId}/`
        );
        return data;
    },
    async createCompetitionNomination({
        competitionId,
        nomination,
    }: {
        competitionId: number;
        nomination: Nomination;
    }): Promise<Nomination> {
        const { data } = await post(
            `/api/competition/${competitionId}/nominations/`,
            nomination
        );
        return data;
    },
};
