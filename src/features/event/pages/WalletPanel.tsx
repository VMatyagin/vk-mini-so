import React, { FC, useContext } from "react";
import {
    PanelHeader,
    Title,
    PanelHeaderBack,
    Group,
    SimpleCell,
    Text,
    Button,
    Div,
    Footer,
    Panel,
} from "@vkontakte/vkui";
import Icon28WalletOutline from "@vkontakte/icons/dist/28/wallet_outline";
import Icon28ReplyOutline from "@vkontakte/icons/dist/28/reply_outline";
import { routerStore } from "../../stores/router-store";

export const WalletPanel: FC<{ id: string }> = ({ id }) => {
    const { goBack, openModal } = useContext(routerStore);
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                <Title level="2" weight="bold">
                    Билеты
                </Title>
            </PanelHeader>
            <Group>
                <SimpleCell
                    before={<Icon28WalletOutline />}
                    after={
                        <Text
                            weight="regular"
                            style={{ color: "var(--icon_tertiary)" }}
                        >
                            600 шт.
                        </Text>
                    }
                    onClick={() => openModal("MODAL_ELSE_WALLET_COUNT")}
                >
                    Всего билетов
                </SimpleCell>
                <SimpleCell
                    before={<Icon28ReplyOutline />}
                    after={
                        <Text
                            weight="regular"
                            style={{ color: "var(--icon_tertiary)" }}
                        >
                            3 шт.
                        </Text>
                    }
                    // onClick={() => changeView("else_event_handle")}
                >
                    Приглашенные гости
                </SimpleCell>
            </Group>
            <Group>
                {/* <FormLayout>
                    <Input
                        top="СПбПУ Петра Великого"
                        value={315}
                        name="1"
                        placeholder="Введите количество билетов"
                    />
                    <Input
                        top="Сводный штаб"
                        name="2"
                        placeholder="Введите количество билетов"
                    />
                    <Input
                        top="Квота выступающих"
                        name="3"
                        placeholder="Введите количество билетов"
                    />
                </FormLayout> */}
            </Group>
            <Group>
                <Div>
                    <Button disabled size="l">
                        Сохранить
                    </Button>
                    <Footer>597 шт. осталось</Footer>
                </Div>
            </Group>
        </Panel>
    );
};
