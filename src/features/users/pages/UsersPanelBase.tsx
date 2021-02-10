import React, { FC, useState } from "react";
import { PanelTemplate } from "../../../ui/panels/template/PanelTemplate";
import { Footer, Group, Header, Search, SimpleCell } from "@vkontakte/vkui";
import { PanelHeader, Title } from "@vkontakte/vkui";
const thematics = [
    {
        id: "1",
        name: "Name",
    },
] as Record<string, string>[];
export const UsersPanelBase: FC<{ id: string }> = ({ id }) => {
    const [search, setSearch] = useState<string>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    return (
        <PanelTemplate id={id}>
            <PanelHeader>
                <Title level="2" weight="bold">
                    Люди
                </Title>
            </PanelHeader>
            <Group>
                <Search
                    value={search}
                    onChange={handleChange}
                    // onIconClick={onFiltersClick}
                />
                <Header mode="tertiary" indicator={thematics.length}>
                    Люди
                </Header>

                {thematics.length > 0 &&
                    thematics.map((thematic) => (
                        <SimpleCell key={thematic.id}>
                            {thematic.name}
                        </SimpleCell>
                    ))}
                {thematics.length === 0 && <Footer>Ничего не найдено</Footer>}
            </Group>
        </PanelTemplate>
    );
};
