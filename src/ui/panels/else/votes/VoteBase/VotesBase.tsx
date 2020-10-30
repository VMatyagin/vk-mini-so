import React, { FC, useEffect, useState } from "react";
import {
  PanelHeader,
  Title,
  PanelHeaderBack,
  PanelSpinner,
  PanelHeaderContent,
  PanelHeaderContext,
  List,
  Cell,
  Group,
  Search,
  SimpleCell,
} from "@vkontakte/vkui";
import { useMst } from "../../../../../feature/stores";
import { PanelTemplate } from "../../../template/PanelTemplate";
import { strapi } from "../../../../../feature/utils/api.service";

import {
  Icon16Dropdown,
  Icon24Done,
  Icon28ChevronRightOutline,
  Icon28EditOutline,
  Icon28SettingsOutline,
  Icon28StickerOutline,
} from "@vkontakte/icons";
import { Poll } from "../../../../../feature/stores/vote-store/types";

export const VotesBase: FC<{ id: string }> = ({ id }) => {
  const store = useMst();

  const [isLoading, setLoading] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const data = await strapi.getPolls();
      setPolls(data);
      setLoading(false);
    };
    getData();
  }, []);

  const [isOpened, setOpened] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("all");

  const toggle = () => {
    setOpened(!isOpened);
  };
  const select = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.dataset["mode"] && setMode(e.currentTarget.dataset["mode"]);
    toggle();
  };
  const changeView = (data: Poll) => {
    store.voteData.setVote(data);
    store.router.setPage("else_votes", "vote_page");
  };
  return (
    <PanelTemplate id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={store.router.goBack} />}>
        <PanelHeaderContent
          status=""
          before=""
          aside={
            <Icon16Dropdown
              style={{
                transform: `rotate(${isOpened ? "180deg" : "0"})`,
              }}
            />
          }
          onClick={toggle}
        >
          <Title level="2" weight="bold">
            Голосования и опросы
          </Title>
        </PanelHeaderContent>
      </PanelHeader>
      <PanelHeaderContext opened={isOpened} onClose={toggle}>
        <List>
          <Cell
            before={<Icon28StickerOutline />}
            asideContent={
              mode === "all" ? <Icon24Done fill="var(--accent)" /> : null
            }
            data-mode="all"
            onClick={select}
          >
            Активные
          </Cell>
          <Cell
            before={<Icon28SettingsOutline />}
            asideContent={
              mode === "admin" ? <Icon24Done fill="var(--accent)" /> : null
            }
            data-mode="admin"
            onClick={select}
          >
            Управление
          </Cell>
        </List>
      </PanelHeaderContext>
      {isLoading ? (
        <PanelSpinner />
      ) : (
        <>
          <Search />
          <Group>
            {polls.map((poll, index) => (
              <SimpleCell
                after={
                  mode === "admin" ? (
                    <Icon28EditOutline />
                  ) : (
                    <Icon28ChevronRightOutline />
                  )
                }
                onClick={() => changeView(poll)}
                key={index}
              >
                {poll.title}
              </SimpleCell>
            ))}
          </Group>
        </>
      )}
    </PanelTemplate>
  );
};
