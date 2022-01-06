import { Icon28AddOutline, Icon28PlaneOutline } from "@vkontakte/icons";
import {
  CellButton,
  Group,
  Header,
  SimpleCell,
  Spinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { useQuery } from "react-query";
import { useRoute } from "react-router5";
import { appStore } from "../../../../stores/app-store";

import { SeasonReport } from "../../../../types";
import { UsersAPI } from "../../../../utils/requests/user-request";

export const UserEditSeasons: FC = observer(() => {
  const { user } = useContext(appStore);
  const {
    route,
    router: { navigate },
  } = useRoute();
  const { boecId } = useMemo(() => route.params, [route]);

  const { data: reports } = useQuery<SeasonReport[]>({
    queryKey: ["user-reports", boecId],
    queryFn: ({ queryKey }) => UsersAPI.getUserReports(queryKey[1] as number),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!boecId,
  });
  const onCellClick = () => {
    navigate("else.boec.seasons", { boecId });
  };

  const canAdd = useMemo(() => {
    // может редачить либо сам, либо стафф
    return boecId === user!.boec.id || user!.isStaff;
  }, [boecId, user]);

  if (!boecId) {
    return null;
  }

  return (
    <Group header={<Header>Года выезда</Header>}>
      {!reports && <Spinner size="small" style={{ margin: "20px 0" }} />}

      {reports?.map((season) => (
        <SimpleCell
          key={season.id}
          // after={season.state !== "accepted" ? "Не зачтен" : "Зачтен"}
          // description={
          //   season.state === "initial" ? <i> - не подтвержденный</i> : null
          // }
          before={<Icon28PlaneOutline />}
        >
          {season.brigade.fullTitle}
          {/* {season.state === "initial" && <i> - не подтвержденный</i>} */}
        </SimpleCell>
      ))}
      {canAdd && (
        <CellButton before={<Icon28AddOutline />} onClick={() => onCellClick()}>
          Добавить сезон
        </CellButton>
      )}
    </Group>
  );
});
