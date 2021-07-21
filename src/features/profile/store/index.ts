import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { Progress } from "../../types";
import { UsersAPI } from "../../utils/requests/user-request";

export class ProfileStore {
    progress: Progress | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    load = async () => {
        const progress = await UsersAPI.getMeProgress();

        runInAction(() => {
            this.progress = progress;
        });
    };
}

export const profileStore = createContext(new ProfileStore());
