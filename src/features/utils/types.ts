import { AxiosError, AxiosResponse } from "axios";

export interface ListResponse<T> {
    items: T[];
    count: number;
}

export interface SuccessResponse<T, IsList extends boolean = false>
    extends AxiosResponse<IsList extends true ? ListResponse<T> : T> {}
export interface FailedResponse<T> extends AxiosError<T> {}