import React, { FC, useEffect } from "react";
import {
    Div,
    Footer,
    Group,
    Header,
    Panel,
    PanelHeaderBack,
    SimpleCell,
} from "@vkontakte/vkui";
import { PanelHeader, Title } from "@vkontakte/vkui";

import { useMst } from "../../stores";
import { Icon28PlaneOutline } from "@vkontakte/icons";
import { observer } from "mobx-react";
import { AbstractView } from "../../../ui/molecules/AbstractView";

export const UsersView: FC<{ id: string }> = observer(({ id }) => {
    const { boec, router } = useMst();

    useEffect(() => {
        return boec.reset();
    }, [boec]);

    return (
        <AbstractView id={id}>
            <Panel id="base">
                <PanelHeader left={<PanelHeaderBack onClick={router.goBack} />}>
                    <Title level="2" weight="bold">
                        Боец
                    </Title>
                </PanelHeader>
                <Group>
                    <Div>
                        <Title level="2" weight="medium">
                            {boec.boecData?.fullName}
                        </Title>
                    </Div>
                </Group>
                {boec.boecData && (
                    <Group
                        header={<Header mode="secondary">Года выезда</Header>}
                    >
                        {boec.boecData.seasons.length > 0 ? (
                            boec.boecData.seasons.map((season) => (
                                <SimpleCell
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
                )}
            </Panel>
        </AbstractView>
    );
});
