import { ModalPage, ModalPageHeader, Div } from "@vkontakte/vkui";
import React, { FC } from "react";
import styled from "styled-components";

const QRImage = styled.img`
    display: block;
    width: 100%;
    height: auto;
`;

interface CalendarInfoModalComponentProps {
    id: string;
    onClose: () => void;
}
export const EventQRModal: FC<CalendarInfoModalComponentProps> = ({
    id,
    onClose,
}) => {
    return (
        <ModalPage
            id={id}
            header={<ModalPageHeader>QR-билет</ModalPageHeader>}
            onClose={onClose}
            settlingHeight={80}
        >
            <Div>
                <QRImage
                    src="https://sun9-12.userapi.com/c857624/v857624818/231dd5/BgkVEkvYW-I.jpg"
                    width={290}
                    height={290}
                />
            </Div>
        </ModalPage>
    );
};
