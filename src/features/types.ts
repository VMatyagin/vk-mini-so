export interface WithId {
    id: number;
}
interface Brigade extends WithId {
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
    DOB: Date | null;
    fullName: string;
    seasons: Seasons[]
}

interface BoecList extends WithId {
    fullName: string;
}

export type Boec<IsList = false> = IsList extends true ? BoecList : BoecWhole;
