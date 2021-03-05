import React, { FC } from "react";
import {
    PanelHeader,
    PanelHeaderBack,
    Title,
    Group,
    Button,
    Panel,
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import { useMst } from "../../stores";

export const EventWinners: FC<{
    id: string;
}> = observer(({ id }) => {
    const store = useMst();
    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    Результаты
                </Title>
            </PanelHeader>
            {/* <FormLayout>
                {Array(3)
                    .fill("1")
                    .map((item, index) => (
                        <Select
                            top='СПО "Глазки"'
                            placeholder="Выберите награду"
                        >
                            <option value="1">Приз 1</option>
                            <option value="2">Приз 2</option>
                        </Select>
                    ))}
            </FormLayout> */}
            <Group description="Номинация / вид спорта не важны для рейтинга, поэтому выставляем только призовые места">
                <Button size="l" mode="tertiary" before={<Icon24Add />}>
                    Добавить победителя
                </Button>
            </Group>
        </Panel>
    );
});
