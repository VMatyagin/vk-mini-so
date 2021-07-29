import axios, { Canceler } from "axios";
import {
    Competition,
    CompetitionParticipant,
    EventType,
    Nomination,
    Participant,
    TicketScan,
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
        visibility,
    }: {
        offset: number;
        limit: number;
        search?: string;
        visibility?: boolean;
    }): Promise<ListResponse<EventType>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            search,
            visibility,
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
        brigadeId,
        status,
    }: {
        offset: number;
        eventId: number;
        limit: number;
        worth: Participant["worth"];
        brigadeId?: number;
        status?: "notapproved" | "approved";
    }): Promise<ListResponse<Participant>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
            worth,
            brigadeId,
            status,
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
        brigadeId,
        isApproved,
    }: {
        boecId: number;
        eventId: number;
        worth: Participant["worth"];
        brigadeId?: number;
        isApproved?: boolean;
    }): Promise<Participant> {
        const { data } = await post(`/api/event/${eventId}/participants/`, {
            boecId,
            worth,
            brigade: brigadeId,
            isApproved,
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
    async approveParticipant({
        participantId,
        eventId,
    }: {
        participantId: number;
        eventId: number;
    }): Promise<Participant> {
        const { data } = await post(
            `/api/event/${eventId}/participants/${participantId}/approve/`
        );
        return data;
    },
    async unapproveParticipant({
        participantId,
        eventId,
    }: {
        participantId: number;
        eventId: number;
    }): Promise<Participant> {
        const { data } = await post(
            `/api/event/${eventId}/participants/${participantId}/unapprove/`
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
        brigadesIds,
        title,
    }: {
        boec: number[];
        brigadesIds?: number[];
        competitionId: number;
        title: string;
    }): Promise<CompetitionParticipant> {
        const { data } = await post(
            `/api/competition/${competitionId}/participants/`,
            {
                boec,
                brigadesIds,
                title,
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
    }): Promise<ListResponse<Nomination>> {
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

export const TicketsAPI = {
    async getLastScans({
        limit,
        offset,
    }: {
        offset: number;
        limit: number;
    }): Promise<ListResponse<TicketScan>> {
        if (cancel) {
            cancel();
        }
        const params = {
            offset,
            limit,
        };

        const { data } = await get("/api/scans/", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params,
        });
        return data;
    },
};
