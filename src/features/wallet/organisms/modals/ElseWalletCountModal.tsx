import {
    ModalPage,
    ModalPageHeader,
    Div,
    usePlatform,
    IOS,
    PanelHeaderButton,
    FormLayout,
    Input,
    Button,
} from "@vkontakte/vkui";
import React, { FC } from "react";

interface CalendarInfoModalComponentProps {
    id: string;
    onClose: () => void;
}
export const ElseWalletCountModal: FC<CalendarInfoModalComponentProps> = ({
    id,
    onClose,
}) => {
    const platform = usePlatform();
    return (
        <ModalPage
            id={id}
            header={
                <ModalPageHeader
                    right={
                        <>
                            {platform === IOS && (
                                <PanelHeaderButton onClick={onClose}>
                                    Готово
                                </PanelHeaderButton>
                            )}
                        </>
                    }
                >
                    Всего билетов
                </ModalPageHeader>
            }
            onClose={onClose}
            settlingHeight={80}
        >
            <FormLayout>
                <Input name="count" value={700} />
            </FormLayout>
            <Div>
                <Button size="l">Сохранить</Button>
            </Div>
        </ModalPage>
    );
};
