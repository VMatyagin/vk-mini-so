import {
    ModalPage,
    ModalPageHeader,
    usePlatform,
    ANDROID,
    IOS,
    PanelHeaderButton,
    Group,
    FormItem,
    SelectMimicry,
    Radio,
} from "@vkontakte/vkui";
import React, { FC } from "react";
import { Icon24Cancel, Icon24Done } from "@vkontakte/icons";
interface CalendarInfoModalComponentProps {
    id: string;
    onClose: () => void;
}
export const UsersFilterModal: FC<CalendarInfoModalComponentProps> = ({
    id,
    onClose,
}) => {
    const platform = usePlatform();
    return (
        <ModalPage
            id={id}
            header={
                <ModalPageHeader
                    left={
                        platform === ANDROID && (
                            <PanelHeaderButton onClick={onClose}>
                                <Icon24Cancel />
                            </PanelHeaderButton>
                        )
                    }
                    right={
                        <PanelHeaderButton onClick={() => undefined}>
                            {platform === IOS ? "Готово" : <Icon24Done />}
                        </PanelHeaderButton>
                    }
                >
                    Фильтры
                </ModalPageHeader>
            }
            onClose={onClose}
        >
            <Group>
                <FormItem top="Отряд">
                    <SelectMimicry placeholder="Не выбрана" />
                </FormItem>
                <FormItem top="Последний год выезда">
                    <SelectMimicry placeholder="Не выбран" />
                </FormItem>
                <FormItem top="Пол">
                    <Radio name="sex" value="male" defaultChecked>
                        Любой
                    </Radio>
                    <Radio name="sex" value="male">
                        Мужской
                    </Radio>
                    <Radio name="sex" value="female">
                        Женский
                    </Radio>
                </FormItem>
            </Group>
        </ModalPage>
    );
};
