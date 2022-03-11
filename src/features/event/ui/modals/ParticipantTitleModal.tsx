import { Icon24Done } from "@vkontakte/icons";
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  PanelHeaderButton,
  IOS,
  Group,
  FormItem,
  ViewWidth,
  useAdaptivity,
  usePlatform,
  Input,
} from "@vkontakte/vkui";
import React, { useState } from "react";
import { RouterStoreInstance } from "../../../stores/router-store";

export const MODAL_EVENT_PARTICIPANT_TITLE = "MODAL_EVENT_PARTICIPANT_TITLE";

export const ParticipantTitleModal = () => {
  const { closeModal, modalCallback } = RouterStoreInstance;
  const [title, setTitle] = useState("");
  const platform = usePlatform();
  const { viewWidth = 100 } = useAdaptivity();
  const isMobile = viewWidth <= ViewWidth.MOBILE;

  const handleClose = () => {
    closeModal();
    setTitle("");
  };
  const onTitleSelect = () => {
    closeModal();

    modalCallback[MODAL_EVENT_PARTICIPANT_TITLE]({ title });
    setTitle("");
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  return (
    <ModalPage
      id={MODAL_EVENT_PARTICIPANT_TITLE}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={handleClose} />}
          right={
            <PanelHeaderButton disabled={!title} onClick={onTitleSelect}>
              {platform === IOS ? "Готово" : <Icon24Done />}
            </PanelHeaderButton>
          }
        >
          Название заявки
        </ModalPageHeader>
      }
      onClose={handleClose}
    >
      <Group>
        <FormItem top="Название">
          <Input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            inputMode="text"
          />
        </FormItem>
      </Group>
    </ModalPage>
  );
};
