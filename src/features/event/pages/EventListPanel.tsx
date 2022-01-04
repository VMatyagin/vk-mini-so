import { FC, useCallback, useMemo, useState } from "react";
import {
  Group,
  Panel,
  PanelHeaderBack,
  Search,
  SimpleCell,
  PanelProps,
} from "@vkontakte/vkui";

import { PanelHeader, Title } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { LazyList } from "../../../ui/organisms/LazyList";
import { debounce } from "@vkontakte/vkjs";
import { EventType } from "../../types";
import { EventAPI } from "../../utils/requests/event-request";
import { useRouter } from "react-router5";

const getDescription = ({
  date,
  place,
}: {
  date?: string | null;
  place?: string | null;
}) => {
  let description = "";
  if (date) {
    description += new Date(date).toLocaleString("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  if (place) {
    description += `| ${place}`;
  }

  return description;
};

export const EventListPanel: FC<PanelProps> = observer((props) => {
  // const { user } = useContext(appStore);
  const { navigate } = useRouter();
  const changeView = (eventId: number) => {
    navigate("else.event.details", { eventId });
  };

  const [search, setSearch] = useState<string>();
  const [filter, setFilter] = useState({
    search: undefined as string | undefined,
  });

  const setFilterD = useMemo(() => debounce(setFilter, 750), [setFilter]);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setFilterD({
        search: event.target.value,
      });
    },
    [setFilterD]
  );

  return (
    <Panel {...props}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        <Title level="2" weight="bold">
          Мероприятия
        </Title>
      </PanelHeader>
      <Group>
        <Search value={search} onChange={handleChange} />
        <LazyList
          title="Мероприятия"
          fetchFn={EventAPI.getEventList}
          queryKey={"event-list"}
          extraFnProp={{
            search: filter.search,
            // visibility: !(user!.shtabs.length > 0 || user?.isStaff)
            //   ? true
            //   : undefined,
          }}
          renderItem={(item: EventType) => (
            <SimpleCell
              key={item.id}
              onClick={() => changeView(item.id)}
              description={getDescription({
                date: item.startDate,
                place: item.location,
              })}
            >
              {`${item.title} | ${item.shtab?.title || "Без организатора"}`}
            </SimpleCell>
          )}
        />
      </Group>
    </Panel>
  );
});
