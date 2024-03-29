import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { UsersAPI } from "../../../../utils/requests/user-request";
import { Footer, SimpleCell, Spinner } from "@vkontakte/vkui";
import { positions } from "../../../../brigades/helpers";
import { useRoute } from "react-router5";

export const UserPositions = observer(() => {
  const { route, router } = useRoute();
  const { boecId } = useMemo(() => route.params, [route]);
  const { data, isLoading } = useQuery({
    queryKey: ["boec-positions", boecId],
    queryFn: ({ queryKey }) => {
      return UsersAPI.getUserPositions(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const onClick = ({
    brigadeId,
    shtabId,
  }: {
    brigadeId?: number;
    shtabId?: number;
  }) => {
    brigadeId && router.navigate("else.brigade.details", { brigadeId });
    shtabId && router.navigate("else.shtab.details", { shtabId });
  };

  return (
    <>
      {isLoading && <Spinner size="small" style={{ margin: "20px 0" }} />}
      {data &&
        (data.length === 0 ? (
          <Footer>Ничего не найдено</Footer>
        ) : (
          data.map((item) => (
            <SimpleCell
              key={item.id}
              onClick={() =>
                onClick({
                  brigadeId: item.brigadeId,
                  shtabId: item.shtabId,
                })
              }
              description={`${new Date(item.fromDate!).toLocaleString("ru", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })} - ${
                item.toDate
                  ? new Date(item.toDate!).toLocaleString("ru", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  : "настоящее время"
              }`}
            >
              {`${item.brigade?.fullTitle || item.shtab?.title || "-"} | ${
                positions[item.position].title
              }`}
            </SimpleCell>
          ))
        ))}
    </>
  );
});
