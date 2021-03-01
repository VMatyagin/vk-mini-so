import React, { FC, useEffect, useState } from "react";
import {
    Cell,
    List,
    Panel,
    PanelHeaderBack,
    PanelHeaderContent,
    PanelHeaderContext,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { useMst } from "../../stores";
import {
    Icon16Dropdown,
    Icon24Done,
    Icon28SettingsOutline,
    Icon28UsersOutline,
} from "@vkontakte/icons";
import { observer } from "mobx-react";
import { AbstractView } from "../../../ui/molecules/AbstractView";
import { UserViewMode } from "../organisms/UserViewMode";
import { UserEditMode } from "../organisms/UserEditMode";
import { SeasonPanel } from "../organisms/SeasonPanel";

export const UsersView: FC<{ id: string }> = observer(({ id }) => {
    const { boec, router } = useMst();
    const [contextOpened, setContextOpened] = useState<boolean>(false);
    const [mode, setMode] = useState<"view" | "edit">("view");
    const toggleContext = () => setContextOpened((prev) => !prev);
    useEffect(() => {
        return boec.reset();
    }, [boec]);

    const select = (e: React.MouseEvent<HTMLElement>) => {
        const mode = e.currentTarget.dataset.mode as "view" | "edit";
        setMode(mode);
        requestAnimationFrame(toggleContext);
    };

    const getBack = () => {
        setMode("view");
    };
    return (
        <AbstractView id={id}>
            <Panel id="base">
                <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                    <PanelHeaderContent
                        aside={
                            <Icon16Dropdown
                                style={{
                                    transform: `rotate(${
                                        contextOpened ? "180deg" : "0"
                                    })`,
                                }}
                            />
                        }
                        onClick={toggleContext}
                    >
                        Боец
                    </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext
                    opened={contextOpened}
                    onClose={toggleContext}
                >
                    <List>
                        <Cell
                            before={<Icon28UsersOutline />}
                            after={
                                mode === "view" ? (
                                    <Icon24Done fill="var(--accent)" />
                                ) : null
                            }
                            onClick={select}
                            data-mode="view"
                        >
                            Просмотр
                        </Cell>
                        <Cell
                            before={<Icon28SettingsOutline />}
                            after={
                                mode === "edit" ? (
                                    <Icon24Done fill="var(--accent)" />
                                ) : null
                            }
                            onClick={select}
                            data-mode="edit"
                        >
                            Редактирование
                        </Cell>
                    </List>
                </PanelHeaderContext>

                {mode === "view" ? (
                    <UserViewMode />
                ) : (
                    <UserEditMode getBack={getBack} />
                )}
            </Panel>
            <SeasonPanel id="season" />
        </AbstractView>
    );
});
