import { Icon16Done } from "@vkontakte/icons";
import { Avatar, Snackbar } from "@vkontakte/vkui";
import React, { FC } from "react";

export const SuccessSnackbar: FC<{ onClose: () => void }> = ({ onClose }) => (
    <Snackbar
        onClose={onClose}
        before={
            <Avatar size={24} style={{ background: "var(--accent)" }}>
                <Icon16Done fill="#fff" width={14} height={14} />
            </Avatar>
        }
    >
        Сохранено
    </Snackbar>
);
