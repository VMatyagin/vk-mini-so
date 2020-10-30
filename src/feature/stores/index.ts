import { types, onSnapshot, Instance } from "mobx-state-tree";
import { AppStore } from "./app-store";
import { RouterStore } from "./router-store";
import { createContext, useContext } from "react";
import { FormStore } from "./form-store";
import { VoteStore } from "./vote-store";

const RootStore = types.model({
  app: AppStore,
  router: RouterStore,
  formData: FormStore,
  voteData: VoteStore,
});

export const rootStore = RootStore.create({
  app: {},
  router: {},
  formData: {
    forms: {},
  },
  voteData: {},
});

onSnapshot(rootStore, (snapshot) => console.log("Snapshot: ", snapshot));
export type RootInstance = Instance<typeof RootStore>;

const RootStoreContext = createContext<null | RootInstance>(null);
export const Provider = RootStoreContext.Provider;

export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
