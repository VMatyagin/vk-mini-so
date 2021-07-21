import { Icon28DrillOutline } from "@vkontakte/icons";
import { PanelSpinner } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useQuery } from "react-query";
import { appStore } from "../../../../stores/app-store";
import { UsersAPI } from "../../../../utils/requests/user-request";
import { profileStore } from "../../../store";
import { Mission } from "../../molecules/Mission";

export const Achievements = observer(() => {
    const { user } = useContext(appStore);
    const { progress } = useContext(profileStore);

    const { data, isLoading } = useQuery({
        queryKey: ["boec-achievements", user?.boec.id],
        queryFn: () => {
            return UsersAPI.getBoecAchievements();
        },
        retry: 1,
        refetchOnWindowFocus: false,
    });

    if (isLoading || !data || !progress) {
        return <PanelSpinner />;
    }
    return (
        <>
            {data
                .filter((item) => item.achieved_at !== null)
                .map((item) => (
                    <Mission
                        key={item.id}
                        Icon={<Icon28DrillOutline />}
                        title={item.title}
                        description={item.description}
                        value={progress[item.type]}
                        maxValue={item.goal}
                        created_at={item.achieved_at}
                    />
                ))}
        </>
    );
});
