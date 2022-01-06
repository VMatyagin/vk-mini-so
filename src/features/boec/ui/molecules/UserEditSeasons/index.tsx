import { Icon28AddOutline, Icon28PlaneOutline } from "@vkontakte/icons";
import {
  CellButton,
  Group,
  Header,
  SimpleCell,
  Spinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";
import { useQuery } from "react-query";
import { useRoute } from "react-router5";

import { Season } from "../../../../types";
import { UsersAPI } from "../../../../utils/requests/user-request";

export const UserEditSeasons: FC = observer(() => {
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { boecId } = useMemo(() => route.params, [route]);

  const { data: seasons } = useQuery<Season[]>({
    queryKey: ["user-seasons", boecId],
    queryFn: ({ queryKey }) => UsersAPI.getUserSeasons(queryKey[1] as number),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!boecId,
  });

  const onCellClick = () => {
    navigate("else.boec.seasons", { boecId });
  };

  return (
    <>
      <Group header={<Header>Года выезда</Header>}>
        {!seasons && <Spinner size="small" style={{ margin: "20px 0" }} />}
        {seasons?.map((season) => (
          <SimpleCell
            key={season.id}
            indicator={season?.reports?.[0]?.year}
            before={<Icon28PlaneOutline />}
            disabled
            description={
              season.state === "initial" ? (
                <i> - не подтвержден комсоставом</i>
              ) : season.state === "rejected" ? (
                "Не зачтен"
              ) : (
                "Зачтен"
              )
            }
          >
            {season?.reports?.[0]?.brigade.fullTitle}
          </SimpleCell>
        ))}
      </Group>

      <Group>
        <CellButton before={<Icon28AddOutline />} onClick={onCellClick}>
          Добавить сезон
        </CellButton>
      </Group>
    </>
  );
});
