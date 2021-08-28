export interface User {
    id: number;
    boec: Boec;
    brigades: Brigade[];
    shtabs: Shtab[];
    seasonBrigades: Brigade[];
    isStaff: boolean;
    unreadActivityCount: number;
}

export interface WithId {
    id: number;
}

export interface Area {
    id: number;
    title: string;
    shortTitle: string;
    brigades: Omit<Brigade, "area">[];
}
export interface Brigade {
    id: number;
    title: string;
    area: Area;
    boecCount: number;
    dateOfBirth: string | null;
    shtab: Shtab;
}

export interface Seasons extends WithId {
    boec: Boec;
    year: number;
    brigade: Brigade;
    brigadeId: number;
    isCandidate: boolean;
    isAccepted: boolean;
}

export interface Boec extends WithId {
    firstName: string;
    lastName: string;
    middleName: string | undefined;
    dateOfBirth: string | null;
    fullName: string;
    vkId: number;
    // for post
    brigadeId: number;
}

export interface EventType {
    id: number;
    status: number;
    title: string;
    description: string | null;
    location: string | null;
    shtab: Shtab | null;
    shtabId: number | null;
    startDate: string | null;
    startTime: string | null;
    organizer: any[];
    volonteer: any[];
    visibility: boolean;
    worth: number;
    isParticipant: boolean;
    isTicketed: boolean;
}
export interface Shtab extends WithId {
    title: string;
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface ScrollPosition {
    x: number;
    y: number;
}

export interface ViewProps {
    id: string;
}
export interface PanelProps {
    id: string;
    viewId: string;
}

export interface Position<isExtended extends boolean = true> {
    id: number;
    boec: isExtended extends true ? Boec : number;
    position: number;
    brigade: isExtended extends true ? Brigade : number | null;
    shtab: isExtended extends true ? Shtab : number | null;
    fromDate: string;
    toDate: string | null;
}

export interface Participant {
    id: number;
    boec: Boec;
    boecId: number;
    event: EventType;
    eventId: number;
    worth: number;
    brigade: Brigade;
}

export interface Competition {
    id: number;
    event: number;
    title: string;
    participantCount: number;
    involvementCount: number;
    winnerCount: number;
    notwinnerCount: number;
    ratingless: boolean;
}

export interface CompetitionParticipant<IsFull extends boolean = false> {
    id: number;
    competition: IsFull extends false ? number : Competition;
    boec: Boec[];
    worth: 0 | 1 | 2 | 3;
    brigades: Brigade[];
    brigadesIds: number[];
    title: string | null;
    nomination: Nomination[];
    // only for updating
    nominationId: number;

    // for history
    event: EventType;
}

export interface Nomination {
    id: number;
    title: string;
    competition: number;
    isRated: boolean;
    sportPlace: number | null;
}

export interface Progress {
    participationCount: number;
    volonteerCount: number;
    organizerCount: number;
    competitionDefault: number;
    competitionPlayoff: number;
    nominations: number;
    seasons: number;
    sportWins: number;
    artWins: number;
}
export interface Achievement {
    id: number;
    type: "seasons";
    createdAt: string;
    title: string;
    description: string;
    goal: number;
    achieved_at: null | string;
}

export interface Warning {
    id: number;
    text: string;
}

export interface Activity {
    id: number;
    type: 0 | 1 | 2;
    createdAt: string;
    warning: Warning | null;
    achievement: Achievement | null;
}

export interface ParticipantHistory {
    eventParticipant: Participant[];
    competitionParticipant: CompetitionParticipant<true>[];
}

export interface Ticket {
    id: number;
    uuid: string;
    boec: Boec;
    event: Event;
    createdAt: string;
    updatedAt: string;
}

export interface TicketScan {
    id: number;
    isFinal: boolean;
    ticket: Ticket;
    createdAt: string;
    updatedAt: string;
}
