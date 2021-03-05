export interface WithId {
    id: number;
}
export interface Brigade extends WithId {
    title: string;
}

export interface Seasons extends WithId {
    brigade: Brigade;
    boec: BoecWhole;
    year: number;
}

interface BoecWhole extends WithId {
    firstName: string;
    lastName: string;
    middleName: string | undefined;
    DOB: string | null;
    fullName: string;
    seasons: Seasons[];
}

interface BoecShort extends WithId {
    fullName: string;
}

export type Boec<IsList = false> = IsList extends true ? BoecShort : BoecWhole;

export interface Event extends WithId {
    status: number;
    title: string;
    description: string | null;
    location: string | null;
    shtab: number | null;
    startDate: string | null;
    startTime: string | null;
    organizer: BoecShort[];
    volonteer: BoecShort[];
    visibility: boolean;
}
export interface Shtab extends WithId {
    title: string;
}
