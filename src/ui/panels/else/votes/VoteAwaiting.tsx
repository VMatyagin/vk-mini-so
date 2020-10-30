import React, { FC } from "react";
import {
  PanelHeader,
  Title,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import { useMst } from "../../../../feature/stores";
import { PanelTemplate } from "../../template/PanelTemplate";
export const VoteAwaiting: FC<{ id: string }> = ({ id }) => {
  const store = useMst();


  return (
    <PanelTemplate id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={store.router.goBack} />}>
        <Title level="2" weight="bold">
          {store.voteData.vote.title}
        </Title>
      </PanelHeader>
      
    </PanelTemplate>
  );
};
