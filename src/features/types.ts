export interface User {
    id: number;
    boec: Boec;
    brigades: Brigade[];
    shtabs: Shtab[];
    seasonBrigades: Brigade[];
    isStaff: boolean;
    unreadActivityCount: number;
}
export interface Viewer {
    id: number;
    boec: Boec;
    isStaff: boolean;
    unreadActivityCount: number;
    points: number;
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
    fullTitle: string;
    area: Area;
    dateOfBirth: string | null;
    shtab: Shtab;
    canEdit: boolean;
    applyStatus: "initial" | "accepted" | "canceled";
    members: number;
    seasonRequestCount: number;
    candidatesCount: number;
}

export interface SeasonReport {
    id: number;
    year: number;
    boecCount: number;
    state: "initial" | "accepted" | "request";
    employer: null | string;
    canEdit: boolean;
    brigade: Brigade;
    brigadeId: number;
    seasons: Season[];
    isSummer: boolean;
}

export interface Season extends WithId {
    boec: Boec;
    boecId: number;
    state: "initial" | "accepted" | "rejected";
    reports: SeasonReport[];
}

export interface Boec extends WithId {
    firstName: string;
    lastName: string;
    middleName: string | undefined;
    dateOfBirth: string | null;
    fullName: string;
    vkId: number;
    canEdit: boolean;
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
    canEdit: boolean;
    participantCount: number;
    image: string;
}
export interface Shtab extends WithId {
    title: string;
    canEdit: boolean;
    fullTitle: string;
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface ScrollPosition {
    x: number;
    y: number;
}

export interface Position<isExtended extends boolean = true> {
    id: number;
    boec: isExtended extends true ? Boec : number;
    boecId: number;
    position: number;
    brigade: isExtended extends true ? Brigade : number | null;
    brigadeId: number;
    shtab: isExtended extends true ? Shtab : number | null;
    shtabId: number;
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
    canEdit: boolean;
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

export interface Voting {
    id: number;
    text: string;
    questions: Question[];
    status: 0 | 1 | 2 | 3;
    question: null | number;
}

export interface Question {
    id: number;
    text: string;
    answers: Answer[];
}
export interface Answer {
    id: number;
    text: string;
    answered: boolean;
}

export interface UserApply {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string | null;
    about: string;
    phone: string;
    brigade: Brigade;
    brigadeId: number;
    university: string;
    vkId: number;
}
export interface BrigadeApply {
    id: number;
    brigade: Brigade;
    boec: Boec;
    createdAt: string;
}
