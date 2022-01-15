import { Panel, PanelProps, Placeholder } from "@vkontakte/vkui";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import { Icon56ThumbsUpOutline } from "@vkontakte/icons";
export const ApplyComplete: FC<PanelProps> = observer((props) => {
  return (
    <Panel {...props}>
      <Placeholder icon={<Icon56ThumbsUpOutline />} stretched>
        Заявка подана
        <br />C Вами свяжутся
      </Placeholder>
    </Panel>
  );
});
