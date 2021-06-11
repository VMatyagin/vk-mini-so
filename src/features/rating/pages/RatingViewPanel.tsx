import { FC, useContext } from "react";
import {
    PanelHeader,
    Group,
    PanelHeaderBack,
    Panel,
    Header,
} from "@vkontakte/vkui";
import {
    Icon16Fire,
    Icon20LightbulbOutline,
    Icon20NotebookCheckOutline,
    Icon20Stars,
    Icon20StatisticsOutline,
    Icon20ThumbsUpOutline,
    Icon20TicketOutline,
    Icon20Users3Outline,
    Icon20WorkOutline,
} from "@vkontakte/icons";
import { ReportCategory } from "../../../ui/molecules/ReportCategory";
import { routerStore } from "../../stores/router-store";

export const RatingViewPanel: FC<{ id: string }> = ({ id }) => {
    const { goBack } = useContext(routerStore);
    // const changeView = (panel: string) => {
    //     store.router.setPage("else_rating", panel);
    // };
    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
                Пример
            </PanelHeader>
            <Group
                header={
                    <Header mode="tertiary">{`Расчет выполнен ${new Date().toLocaleString()}`}</Header>
                }
            />
            {/* <Group header={<Header mode="tertiary">Творческий блок</Header>}>
                <SimpleCell
                    expandable={true}
                    description={"текст"}
                    after="3 Оганизатора, 2 Волонтера, Победа"
                >
                    Название мероприятия
                </SimpleCell>
                <SimpleCell
                    expandable={true}
                    description={""}
                    after="3 Оганизатора, 2 Волонтера, Победа"
                >
                    Название мероприятия
                </SimpleCell>
                <Button
                    stretched
                    mode="tertiary"
                    size="m"
                    style={{ marginTop: 10 }}
                >
                    Показать всё
                </Button>
            </Group> */}
            <Group>
                <ReportCategory
                    title="Блок «Творчество»"
                    // description="15 место"
                    Icon={<Icon16Fire />}
                />
                <ReportCategory
                    title="Блок «Спорт»"
                    description="15 место"
                    Icon={<Icon20Stars />}
                />
                <ReportCategory
                    title="Блок «Добровольчество»"
                    description="15 место"
                    Icon={<Icon20Users3Outline />}
                />
                <ReportCategory
                    title="Блок «Образовательный»"
                    description="15 место"
                    Icon={<Icon20NotebookCheckOutline />}
                />
                <ReportCategory
                    title="Блок «Городские мероприятия»"
                    description="15 место"
                    Icon={<Icon20TicketOutline />}
                />
                <ReportCategory
                    title="Блок «Образ бойца»"
                    description="15 место"
                    Icon={<Icon20ThumbsUpOutline />}
                />
                <ReportCategory
                    title="Блок «Трудовые сезон и межсезонье»"
                    description="15 место"
                    Icon={<Icon20WorkOutline />}
                />
            </Group>
            <Group>
                <ReportCategory
                    title="В направлении"
                    description="15 место"
                    Icon={<Icon20LightbulbOutline />}
                />
                <ReportCategory
                    title="Общий рейтинг"
                    description="15 место"
                    Icon={<Icon20StatisticsOutline />}
                />
            </Group>
        </Panel>
    );
};
