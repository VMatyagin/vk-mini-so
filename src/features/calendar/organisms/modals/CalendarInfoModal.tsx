import {
  ModalPage,
  ModalPageHeader,
  List,
  Text,
  Button,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import React, { FC } from "react";
import Icon28InfoOutline from "@vkontakte/icons/dist/28/info_outline";
import Icon28ArrowRightOutline from "@vkontakte/icons/dist/28/arrow_right_outline";
interface CalendarInfoModalComponentProps {
  id: string;
  onClose: () => void;
}
export const CalendarInfoModal: FC<CalendarInfoModalComponentProps> = ({
  id,
  onClose,
}) => {
  return (
      <ModalPage
          id={id}
          header={
              <ModalPageHeader
                  right={
                      <Button mode="tertiary" onClick={onClose}>
                          Понятно
                      </Button>
                  }
              >
                  Как ориентироваться?
              </ModalPageHeader>
          }
          onClose={onClose}
          settlingHeight={80}
      >
          <List>
              <SimpleCell after={<Icon28InfoOutline />}>
                  <Title
                      level="3"
                      weight="semibold"
                      style={{ marginBottom: 16, whiteSpace: "normal" }}
                  >
                      Что за цвета?
                  </Title>
                  <Text weight="regular" style={{ whiteSpace: "normal" }}>
                      Цвет мероприятия обозначает уровень мероприятия
                  </Text>
              </SimpleCell>
              <SimpleCell>
                  <Title
                      level="3"
                      weight="semibold"
                      style={{ marginBottom: 16, whiteSpace: "normal" }}
                  >
                      Как попасть на городское мероприятие?
                  </Title>
                  <Text weight="regular" style={{ whiteSpace: "normal" }}>
                      Нажать три точки и выбрать пункт «Хочу пойти!»
                  </Text>
              </SimpleCell>
              <SimpleCell after={<Icon28ArrowRightOutline />}>
                  <Title
                      level="3"
                      weight="semibold"
                      style={{ marginBottom: 16, whiteSpace: "normal" }}
                  >
                      И больше ничего не нужно?
                  </Title>
                  <Text weight="regular" style={{ whiteSpace: "normal" }}>
                      Чтобы попасть на мероприятие, нужно на входе предъявить
                      QR-код из раздела «Билеты»
                  </Text>
              </SimpleCell>
          </List>
      </ModalPage>
  );
};
