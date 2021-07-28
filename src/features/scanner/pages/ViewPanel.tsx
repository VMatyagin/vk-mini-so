import { FC, useState } from "react";
import {
    Avatar,
    Button,
    Div,
    Group,
    Panel,
    Snackbar,
    Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { Icon16Done } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { PanelProps } from "../../types";
import QrReader from "react-qr-reader";
import styled from "styled-components";

const QRContainer = styled.div`
    width: 100%;
    max-width: 400px;
    height: 400px;
    margin: 0 auto;
    background-color: black;
`;

export const ViewPanel: FC<PanelProps> = observer(({ id, viewId }) => {
    const [isStarted, setStarted] = useState(false);
    const [Snack, setSnackBar] = useState<React.ReactNode>(null);

    const onError = () => {};
    const onScan = (data: string | null) => {
        data !== null &&
            setSnackBar(
                <Snackbar
                    onClose={() => setSnackBar(null)}
                    before={
                        <Avatar
                            size={24}
                            style={{ background: "var(--accent)" }}
                        >
                            <Icon16Done fill="#fff" width={14} height={14} />
                        </Avatar>
                    }
                >
                    {data}
                </Snackbar>
            );
    };
    return (
        <Panel id={id}>
            <PanelHeader>
                <Title level="2" weight="bold">
                    Сканнер
                </Title>
            </PanelHeader>
            <Group>
                <QRContainer>
                    {isStarted ? (
                        <QrReader
                            delay={300}
                            onError={onError}
                            onScan={onScan}
                            style={{ width: "100%", height: "100%" }}
                            showViewFinder={false}
                        />
                    ) : null}
                </QRContainer>
                <Div>
                    <Button
                        onClick={() => {
                            setStarted((prev) => !prev);
                        }}
                        size="l"
                        stretched={true}
                    >
                        {isStarted
                            ? "Закончить сканирование"
                            : "Начать сканирование"}
                    </Button>
                </Div>
            </Group>
            {Snack}
        </Panel>
    );
});
