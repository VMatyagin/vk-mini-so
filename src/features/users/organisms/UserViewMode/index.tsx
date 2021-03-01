import { Icon28PlaneOutline } from "@vkontakte/icons";
import { Div, Footer, Group, Header, SimpleCell, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react";
import React from "react";
import { useMst } from "../../../stores";

export const UserViewMode = observer(() => {
    const { boec } = useMst();
    return boec.boecData ? (
        <>
            <Group>
                <Div>
                    <Title level="2" weight="medium">
                        {boec.boecData?.fullName}
                    </Title>
                </Div>
            </Group>
            <Group header={<Header mode="secondary">Года выезда</Header>}>
                {boec.boecData.seasons.length > 0 ? (
                    boec.boecData.seasons.map((season) => (
                        <SimpleCell
                            key={season.id}
                            indicator={season.year}
                            before={<Icon28PlaneOutline />}
                        >
                            {season.brigade.title}
                        </SimpleCell>
                    ))
                ) : (
                    <Footer>Ничего не найдено</Footer>
                )}
            </Group>
        </>
    ) : null;
});
