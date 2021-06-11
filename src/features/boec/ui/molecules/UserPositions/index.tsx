import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UsersAPI } from "../../../../utils/requests/user-request";
import { boecStore } from "../../../store/boecStore";
import { Cell, Footer, Spinner } from "@vkontakte/vkui";
import { positions } from "../../../../brigades/helpers";

export const UserPositions = observer(() => {
    const { boecId } = useContext(boecStore);

    const { data, isLoading } = useQuery({
        queryKey: ["boec-positions", boecId],
        queryFn: ({ queryKey }) => {
            return UsersAPI.getUserPositions(queryKey[1] as number);
        },
        retry: 1,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            {isLoading && <Spinner size="small" style={{ margin: "20px 0" }} />}
            {data &&
                (data.length === 0 ? (
                    <Footer>Ничего не найдено</Footer>
                ) : (
                    data.map((item) => (
                        <Cell
                            description={`${new Date(
                                item.fromDate!
                            ).toLocaleString("ru", {
                                month: "2-digit",
                                year: "2-digit",
                            })} - ${
                                item.toDate
                                    ? new Date(item.toDate!).toLocaleString(
                                          "ru",
                                          {
                                              month: "2-digit",
                                              year: "2-digit",
                                          }
                                      )
                                    : "настоящее время"
                            }`}
                        >
                            {`${item.brigade.title} | ${
                                positions[item.position].title
                            }`}
                        </Cell>
                    ))
                ))}
        </>
    );
});
