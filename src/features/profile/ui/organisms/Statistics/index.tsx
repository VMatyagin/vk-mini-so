import { InfoRow, PanelSpinner, SimpleCell } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { profileStore } from "../../../store";

// const Statistics = () => (
//     <>
//         <SimpleCell>
//             <InfoRow header="Участвовал в конкурсном мероприятии">5</InfoRow>
//         </SimpleCell>
//         <SimpleCell>
//             <InfoRow header="Был волонтером на мероприятии">{4}</InfoRow>
//         </SimpleCell>
//         <SimpleCell>
//             <InfoRow header="Был организатором мероприятия">{0}</InfoRow>
//         </SimpleCell>
//     </>
// );

const TRANSLATES = {
    participation_count: "Посещение мероприятия",
    volonteer_count: "Волонтерство",
    organizer_count: "Организаторство",
    competition_default: "Подача заявки",
    competition_playoff: "Прохождение в плейофф",
    nominations: "Номинации",
    seasons: "Сезоны",
    sport_wins: "Номинация в спорте",
    art_wins: "Номинация в творчестве",
};

export const Statistics = observer(() => {
    const { progress } = useContext(profileStore);

    if (!progress) {
        return <PanelSpinner />;
    }

    return (
        <>
            {Object.entries(progress).map((item) => (
                <SimpleCell>
                    <InfoRow
                        header={TRANSLATES[item[0] as keyof typeof TRANSLATES]}
                    >
                        {item[1]}
                    </InfoRow>
                </SimpleCell>
            ))}
        </>
    );
});
