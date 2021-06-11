import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Seasons } from "../../types";

export class BoecStore {
    boecId: number | null = null;
    selectedSeason: number | null = null;
    seasons: Seasons[] | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setBoecId = (id: number | null) => {
        this.boecId = id;
    };

    updateSeasons = (season: Seasons) => {
        if (this.seasons) {
            let newSeasons = [];
            if (this.seasons.map((item) => item.id).includes(season.id)) {
                newSeasons = this.seasons.filter((item) => {
                    if (item.id === season.id) {
                        return season;
                    }
                    return item;
                });
            } else {
                newSeasons = [...this.seasons, season];
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

    selectSeason = (id: number) => {
        this.selectedSeason = id;
    };
}

export const BoecStoreInstance = new BoecStore();

export const boecStore = createContext(BoecStoreInstance);
