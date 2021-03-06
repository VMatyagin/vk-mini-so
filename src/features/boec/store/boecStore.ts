import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Position, Seasons } from "../../types";

export class BoecStore {
    boecId: number | null = null;
    seasons: Seasons[] | null = null;
    selectedPosition: Position | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setBoecId = (id: number | null) => {
        this.boecId = id;
    };

    updateSeasons = (season: Seasons) => {
        const seasons = this.seasons;
        if (seasons) {
            let newSeasons = [];

            if (seasons.map((item) => item.id).includes(season.id)) {
                newSeasons = seasons.map((item) => {
                    if (item.id === season.id) {
                        return season;
                    }
                    return item;
                });
            } else {
                newSeasons = [...seasons, season];
            }

            this.seasons = newSeasons.sort((a, b) => a.year - b.year);
        } else {
            this.seasons = [season];
        }
    };
    removeSeason = (id: number) => {
        if (this.seasons) {
            this.seasons = this.seasons.filter((item) => item.id !== id);
        }
    };
    setSeasons = (data: Seasons[]) => {
        this.seasons = data.sort((a, b) => a.year - b.year);
    };

    setPosition = (pos: Position) => {
        this.selectedPosition = pos;
    };
    clearPosition = () => {
        this.selectedPosition = null;
    };
}

export const BoecStoreInstance = new BoecStore();

export const boecStore = createContext(BoecStoreInstance);
