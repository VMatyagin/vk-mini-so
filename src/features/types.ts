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
    boec_count: number;
    DOB: string | null;
    shtab: Shtab;
}

export interface Seasons extends WithId {
    boec: Boec;
    year: number;
    brigade: Brigade;
}

export interface Boec extends WithId {
    firstName: string;
    lastName: string;
    middleName: string | undefined;
    DOB: string | null;
    fullName: string;
}

export interface Event extends WithId {
    status: number;
    title: string;
    description: string | null;
    location: string | null;
    shtab: number | null;
    startDate: string | null;
    startTime: string | null;
    organizer: any[];
    volonteer: any[];
    visibility: boolean;
    worth: string;
}
export interface Shtab extends WithId {
    title: string;
}

export interface EventOrder<IsUPDATE extends boolean = false> extends WithId {
    brigades: IsUPDATE extends true ? undefined : any[];
    event: number;
    participations: any[];
    isСontender: boolean;
    place: string | null;
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
