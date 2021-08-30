import { FC, useContext, useState } from "react";
import {
  PanelHeader,
  PanelHeaderBack,
  Title,
  Group,
  Panel,
  Header,
  CellButton,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";

import { Boec } from "../../types";
import { Icon24Add } from "@vkontakte/icons";
import { routerStore } from "../../stores/router-store";

const titles = {
  organizers: {
    title: "Организаторы",
    btn: "организатора",
  },
  volonteers: {
    title: "Волонтеры",
    btn: "волонтера",
  },
};

export const EventUsers: FC<{
  id: string;
  type: "organizers" | "volonteers";
}> = observer(({ id, type }) => {
  const { setPage, goBack } = useContext(routerStore);

  const [data] = useState<Boec[]>();

  // const onLoad = useCallback((data: Boec[]) => {
  //     setData(data);
  // }, []);

  // const { fetch, errors, isLoading } = useFetch(SoAPI.getEventUsers, onLoad);

  // useEffect(() => {
  //     eventData && fetch(eventData.id, type);
  // }, [fetch, eventData, type]);

  const onAdd = () => {
    setPage("else_event_handle", `event_find_${type}`);
  };
  // const onDelete = (clickEvent: React.MouseEvent<HTMLElement>) => {
  //     const userId = clickEvent.currentTarget.dataset.userid;
  //     openPopout(
  //         <Alert
  //             actions={[
  //                 {
  //                     title: "Удалить",
  //                     mode: "destructive",
  //                     autoclose: true,
  //                     action: () => {
  //                         if (userId && eventData) {
  //                             SoAPI.removeEventUser(
  //                                 eventData.id,
  //                                 type,
  //                                 Number(userId)
  //                             ).then(({ data }) => setData(data));
  //                         }
  //                     },
  //                 },
  //                 {
  //                     title: "Отмена",
  //                     autoclose: true,
  //                     mode: "cancel",
  //                 },
  //             ]}
  //             actionsLayout="vertical"
  //             onClose={closePopout}
  //             header="Подтвердите действие"
  //             text="Вы уверены, что хотите удалить это мероприятие?"
  //         />
  //     );
  // };

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
        <Title level="2" weight="bold">
          {titles[type].title}
        </Title>
      </PanelHeader>
      <Group
        header={
          <Header mode="tertiary" indicator={data?.length}>
            {titles[type].title}
          </Header>
        }
      >
        <CellButton before={<Icon24Add />} onClick={onAdd}>
          Добавить {titles[type].btn}
        </CellButton>
        {/* <ItemsList
                    data={data}
                    isLoading={isLoading}
                    isError={!!errors}
                    renderItem={(item) => (
                        <SimpleCell
                            key={item.id}
                            after={
                                <Icon24Cancel
                                    onClick={onDelete}
                                    data-userid={item.id}
                                />
                            }
                        >
                            {item.fullName}
                        </SimpleCell>
                    )}
                /> */}
      </Group>
    </Panel>
  );
});
