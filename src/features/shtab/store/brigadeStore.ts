import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class ShtabStore {
    shtabId: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setShtabId = (data: number) => {
        this.shtabId = data;
    };
    reset = () => {
        this.shtabId = null;
    };
}

export const ShtabStoreInstance = new ShtabStore();

export const shtabStore = createContext(ShtabStoreInstance);
