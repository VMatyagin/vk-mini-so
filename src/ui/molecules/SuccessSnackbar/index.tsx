import { Icon16Done } from "@vkontakte/icons";
import { Avatar, Snackbar } from "@vkontakte/vkui";
import React from "react";
import { useMst } from "../../../features/stores";

export const SuccessSnackbar = () => {
    const { router } = useMst();
    return (
        <Snackbar
            onClose={router.closePopout}
            before={
                <Avatar size={24} style={{ background: "var(--accent)" }}>
                    <Icon16Done fill="#fff" width={14} height={14} />
                </Avatar>
            }
        >
            Сохранено
        </Snackbar>
    );
};
