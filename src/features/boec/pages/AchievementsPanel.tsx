import {
    Group,
    Header,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelSpinner,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useQuery } from "react-query";
import { routerStore } from "../../stores/router-store";

import { PanelProps } from "../../types";
import { UsersAPI } from "../../utils/requests/user-request";
import { boecStore } from "../store/boecStore";

// const getText = (
//     competition: Competition,
//     title: string | null,
//     nomination: Nomination[]
// ) => {
//     let text = "";

//     if (competition) {
//         text += competition.title;
//     }

//     if (title) {
//         text += ` ${title}`;
//     }

//     if (nomination) {
//         nomination.forEach((item) => {
//             text += ` | ${item.title}`;
//         });
//     }

//     return text;
// };

export const AchievementsPanel: FC<PanelProps> = observer(({ id }) => {
    const { goBack } = useContext(routerStore);
    const { boecId } = useContext(boecStore);

    const { data } = useQuery({
        queryKey: ["user-achievements", boecId],
        queryFn: () => UsersAPI.getBoecAchievements(boecId!),
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!boecId,
    });

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                Достижения
            </PanelHeader>
            {!data && <PanelSpinner />}
            {data && (
                <Group
                    header={
                        <Header mode="secondary">Участие в мероприятиях</Header>
                    }
                >
                    {/* {data.event_participant.length === 0 && (
                        <Footer>Ничего не найдено</Footer>
                    )}
                    {data.event_participant.map((participant) => (
                        <SimpleCell
                            key={`${participant.event.title}-${participant.worth}`}
                            description={
                                PARTICIPANT_WORTH[participant.worth].title
                            }
                        >
                            {participant.event.title}
                        </SimpleCell>
                    ))} */}
                </Group>
            )}
            {data && (
                <Group
                    header={
                        <Header mode="secondary">
                            Участие в конкурсах и соревнованиях
                        </Header>
                    }
                >
                    {/* {data.competition_participant.length === 0 && (
                        <Footer>Ничего не найдено</Footer>
                    )}
                    {data.competition_participant.map((participant) => (
                        <SimpleCell
                            key={`${participant.event.title}-${participant.worth}`}
                            description={participant.event.title}
                        >
                            {getText(
                                participant.competition,
                                participant.title,
                                participant.nomination
                            )}
                        </SimpleCell>
                    ))} */}
                </Group>
            )}
        </Panel>
    );
});
