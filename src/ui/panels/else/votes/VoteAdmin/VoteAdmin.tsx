import React, { FC, ReactNode, useEffect, useState } from "react";
import {
  PanelHeader,
  Title,
  PanelHeaderBack,
  ScreenSpinner,
  FormLayout,
  Input,
  Cell,
  Switch,
  Snackbar,
  Button,
  Group,
  SimpleCell,
  Header,
} from "@vkontakte/vkui";
import { useMst } from "../../../../../feature/stores";
import { PanelTemplate } from "../../../template/PanelTemplate";
import { strapi } from "../../../../../feature/utils/api.service";
import socketIOClient from "socket.io-client";
import { observer } from "mobx-react";
import { Icon28UserOutline } from "@vkontakte/icons";

export const VoteAdmin: FC<{ id: string }> = observer(({ id }) => {
  const store = useMst();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let socket: SocketIOClient.Socket | null = null;
    if (!store.voteData.vote.disabled) {
      store.router.openPopout(<ScreenSpinner />);

      socket = socketIOClient("http://localhost:1337/vote");

      socket.on("connect", () => {
        store.router.closePopout();
        console.log("connected");
      });
      socket.emit("join", { id: store.voteData.vote.id });
      socket.on("reconnect", store.router.closePopout);

      socket.on("reconnecting", () => {
        store.router.openPopout(<ScreenSpinner />);
      });
    }

    return () => {
      socket && socket.disconnect();
      socket && console.log("disconnectes");
    };
  }, [store.voteData, store.router]);

  useEffect(() => {
    const getData = async () => {
      setLoading(false);
    };
    getData();
  }, [store]);

  const [formState, setFormState] = useState({
    title: store.voteData.vote.title,
    disabled: store.voteData.vote.disabled,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.currentTarget;
    // openBase();
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [snackBar, setSnackBar] = useState<ReactNode | null>(null);
  const openBase = () => {
    if (snackBar) return;
    setSnackBar(
      <Snackbar layout="vertical" onClose={() => setSnackBar(null)}>
        Сохранено
      </Snackbar>
    );
  };

  const formHandle = (e: React.FormEvent) => {
    e.preventDefault();
    strapi.updatePoll(store.voteData.vote.id, formState).then((data) => {
      openBase();
      store.voteData.setVote(data);
    });
  };

  return (
    <PanelTemplate id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={store.router.goBack} />}>
        <Title level="2" weight="bold">
          {store.voteData.vote.title}
        </Title>
      </PanelHeader>
      <Group>
        <FormLayout onSubmit={formHandle}>
          <Input
            type="text"
            top="Название"
            name="title"
            value={formState.title}
            onChange={onChange}
          />
          <Cell
            asideContent={
              <Switch
                name="disabled"
                checked={formState.disabled}
                onChange={onChange}
              />
            }
          >
            Завершен
          </Cell>
          <Button size="xl">Сохранить</Button>
        </FormLayout>
      </Group>
      <Group>
        <Header mode="secondary">Прочее</Header>
        <SimpleCell expandable before={<Icon28UserOutline />}>
          Участники
        </SimpleCell>
        <SimpleCell expandable before={<Icon28UserOutline />}>
          Голоса
        </SimpleCell>
      </Group>
      {snackBar}
    </PanelTemplate>
  );
});

// удаление голосов по отрядам или штабам из списка. В этом же списке можно проставить вес голоса.Круто если выпадающий списко
// statuses:
