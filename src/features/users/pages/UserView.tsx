import React, { FC, useCallback, useEffect, useState } from "react";
import {
    Cell,
    CellButton,
    Group,
    List,
    Panel,
    PanelHeaderBack,
    PanelHeaderContent,
    PanelHeaderContext,
    Title,
    useAdaptivity,
    ViewWidth,
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
    const toggleContext = useCallback(
        () => setContextOpened((prev) => !prev),
        []
    );
    useEffect(() => {
        return boec.reset();
    }, [boec]);

    const select = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const mode = e.currentTarget.dataset.mode as "view" | "edit";
            setMode(mode);
            requestAnimationFrame(toggleContext);
        },
        [toggleContext]
    );

    const getBack = () => {
        setMode("view");
    };
    const handleClose = () => {
        requestAnimationFrame(toggleContext);
    };
    const { viewWidth = 100 } = useAdaptivity();

    const isDesktop = viewWidth >= ViewWidth.TABLET;

    return (
        <AbstractView id={id}>
            <Panel id="base">
                <PanelHeader
                    left={
                        <PanelHeaderBack
                            onClick={mode === "edit" ? getBack : router.goBack}
                        />
                    }
                >
                    {isDesktop ? (
                        <Title level="2" weight="bold">
                            {mode === "view" ? "Боец" : "Редактирование"}
                        </Title>
                    ) : (
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
                    )}
                </PanelHeader>
                {!isDesktop && (
                    <PanelHeaderContext
                        opened={contextOpened}
                        onClose={handleClose}
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
                )}

                {mode === "view" ? (
                    <>
                        <UserViewMode />
                        <Group>
                            <CellButton onClick={() => setMode("edit")}>
                                Редактировать
                            </CellButton>
                        </Group>
                    </>
                ) : (
                    <UserEditMode />
                )}
            </Panel>
            <SeasonPanel id="season" />
        </AbstractView>
    );
});
