import { types, onSnapshot, Instance } from "mobx-state-tree";
import { AppStore } from "./app-store";
import { RouterStore } from "./router-store";
import { createContext, useContext } from "react";
import { FormStore } from "./form-store";
import { BoecStore } from "./boec-store";
import { EventStore } from "./event-store";

const RootStore = types.model({
    app: AppStore,
    router: RouterStore,
    formData: FormStore,
    boec: BoecStore,
    event: EventStore,
});

export const rootStore = RootStore.create({
    app: {},
    router: {},
    formData: {
        forms: {},
    },
    boec: {},
    event: {},
});

onSnapshot(rootStore, (snapshot) => console.log("Snapshot: ", snapshot));
export type RootInstance = Instance<typeof RootStore>;

const RootStoreContext = createContext<null | RootInstance>(null);
export const Provider = RootStoreContext.Provider;

export const useMst = () => {
    const store = useContext(RootStoreContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
};
