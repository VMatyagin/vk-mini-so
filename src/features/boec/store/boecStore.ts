import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Position } from "../../types";

export class BoecStore {
    boecId: number | null = null;
    selectedPosition: Position | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setBoecId = (id: number | null) => {
        this.boecId = id;
    };

    setPosition = (pos: Position) => {
        this.selectedPosition = pos;
    };
    clearPosition = () => {
        this.selectedPosition = null;
    };
    clear = () => {
        this.boecId = null;
        this.selectedPosition = null;
    };
}

export const BoecStoreInstance = new BoecStore();

export const boecStore = createContext(BoecStoreInstance);
