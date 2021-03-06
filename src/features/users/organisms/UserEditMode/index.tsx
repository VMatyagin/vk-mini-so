import { observer } from "mobx-react";
import React, { FC } from "react";
import { UserEditMain } from "../../molecules/UserEditMain";
import { UserEditSeasons } from "../../molecules/UserEditSeasons";

export const UserEditMode: FC = observer(() => {
    return (
        <>
            <UserEditMain />
            <UserEditSeasons />
        </>
    );
});
