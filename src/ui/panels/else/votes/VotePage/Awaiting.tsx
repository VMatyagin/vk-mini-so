import { Group, Header, List, SimpleCell } from "@vkontakte/vkui";
import React, { FC, useEffect } from "react";
import { Result } from "../../../../../feature/stores/vote-store/types";
interface AwaitingProps {
    results: []
}
export const Awaiting:FC<AwaitingProps> = ({ results }: { results: Result[] }) => {
  return (
    <Group header={<Header mode="secondary">Проголосовало</Header>}>
      <List>
        <SimpleCell indicator="8">За</SimpleCell>
        <SimpleCell indicator="3">Против</SimpleCell>
        <SimpleCell indicator="2">Воздержалось</SimpleCell>
      </List>
    </Group>
  );
};
