import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class BrigadeStore {
    brigadeId: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }
    setBrigadeId = (id: number) => {
        this.brigadeId = id;
    };
}

export const BrigadeStoreInstance = new BrigadeStore();

export const brigadeStore = createContext(BrigadeStoreInstance);
