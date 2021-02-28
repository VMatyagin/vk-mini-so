import { cast, types } from "mobx-state-tree";

import { Boec } from "../../types";
import { SoAPI } from "../../utils/api.service";

export const BoecStore = types
    .model("BoecStore", {
        boecData: types.maybeNull(
            types.model({
                id: types.optional(types.number, 0),
                firstName: types.optional(types.string, ""),
                lastName: types.optional(types.string, ""),
                fullName: types.optional(types.string, ""),
                middleName: types.maybe(types.string),
                DOB: types.maybeNull(types.Date),
                seasons: types.array(
                    types.model({
                        id: types.number,
                        brigade: types.model({
                            id: types.number,
                            title: types.string,
                        }),
                        year: types.number,
                    })
                ),
            })
        ),
    })
    .actions((self) => ({
        setBoec(data: Boec) {
            self.boecData = cast(data);
        },
        reset() {
            self.boecData = null;
        },
        fetchBoec(id: string) {
            SoAPI.getUserData(id).then(({ data }) => {
                this.setBoec(data);
            });
        },
    }));
