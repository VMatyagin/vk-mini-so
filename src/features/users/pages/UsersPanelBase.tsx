import React, { FC, useEffect, useState } from "react";
import { PanelTemplate } from "../../../ui/panels/template/PanelTemplate";
import { Footer, Group, Header, Search, SimpleCell } from "@vkontakte/vkui";
import { PanelHeader, Title } from "@vkontakte/vkui";
import { SoAPI } from "../../utils/api.service";
import { useFetch } from "../../utils/useFetch";

export const UsersPanelBase: FC<{ id: string }> = ({ id }) => {
    const { fetch, data } = useFetch(SoAPI.getList);

    useEffect(() => {
        fetch({
            limit: 20,
            offset: 0,
        });
    }, [fetch]);
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
                <Header mode="tertiary" indicator={data && data.count}>
                    Люди
                </Header>
                {data && (
                    <>
                        {data &&
                            data.items.length > 0 &&
                            data.items.map((item) => (
                                <SimpleCell
                                    key={item.id}
                                >{`${item.lastName} ${item.firstName} ${item.middleName}`}</SimpleCell>
                            ))}
                        {data.items.length === 0 && (
                            <Footer>Ничего не найдено</Footer>
                        )}
                    </>
                )}
            </Group>
        </PanelTemplate>
    );
};
