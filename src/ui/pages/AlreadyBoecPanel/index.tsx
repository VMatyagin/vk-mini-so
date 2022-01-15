import { Panel, PanelProps, Placeholder } from "@vkontakte/vkui";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import { Icon56GhostOutline } from "@vkontakte/icons";

export const AlreadyBoecPanel: FC<PanelProps> = observer((props) => {
  return (
    <Panel {...props}>
      <Placeholder icon={<Icon56GhostOutline />} stretched>
        К сожалению, комсостав еще не добавил тебя
        <br />
        Вперед к нему в ЛС!
      </Placeholder>
    </Panel>
  );
});
