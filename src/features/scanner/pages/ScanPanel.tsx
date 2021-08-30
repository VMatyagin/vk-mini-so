import { FC, useContext, useState } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  PanelProps,
  Title,
} from "@vkontakte/vkui";
import { PanelHeader } from "@vkontakte/vkui";

import { observer } from "mobx-react-lite";
import QrReader from "react-qr-reader";
import styled from "styled-components";
import { routerStore } from "../../stores/router-store";
import { MODAL_TICKET_SCAN } from "../ui/organisms/modals/TicketScanModal";

const QRContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 80vw !important;
  max-width: 270px;
  max-height: 270px;
  overflow: hidden;
  border-radius: 15px;
  margin: 20px auto;
  background-color: black;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const Finder = styled.div`
  top: 50px;
  left: 50px;
  right: 50px;
  bottom: 50px;
  z-index: 1;
  border: 5px solid green;
  border-radius: 15px;
  position: absolute;
`;

export const ScanPanel: FC<PanelProps> = observer((props) => {
  const [isStarted, setStarted] = useState(false);
  const { openModal } = useContext(routerStore);

  const onError = () => {};
  const onScan = (data: string | null) => {
    data !== null && openModal(MODAL_TICKET_SCAN, { data });
  };
  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Сканирование
        </Title>
      </PanelHeader>
      <Group>
        <QRContainer onClick={() => setStarted((prev) => !prev)}>
          {isStarted ? (
            <>
              <QrReader
                delay={300}
                onError={onError}
                onScan={onScan}
                style={{ width: "100%", height: "100%" }}
                showViewFinder={false}
              />
              <Finder />
            </>
          ) : (
            <Title level="2" weight="medium">
              Начать
            </Title>
          )}
        </QRContainer>
        <Title level="2" weight="regular" style={{ textAlign: "center" }}>
          Наведите камеру на QR-код
        </Title>
      </Group>
    </Panel>
  );
});
