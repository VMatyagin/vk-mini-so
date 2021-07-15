import { ActionSheet, ActionSheetItem } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { appStore } from "../../../../stores/app-store";
import { routerStore } from "../../../../stores/router-store";

interface SubjectSelectingCellProps {
    onlyBrigades?: boolean;
    onBrigadeClick: (id: number) => void;
    onShtabClick?: (id: number) => void;
    children: (props: { handleClick: () => void }) => React.ReactElement;
    isForBoec?: boolean;
}
export const SubjectSelectingCell: FC<SubjectSelectingCellProps> = observer(
    ({ children, onlyBrigades, onBrigadeClick, onShtabClick, isForBoec }) => {
        const { user } = useContext(appStore);
        const { openPopout, closePopout } = useContext(routerStore);

        const handleClick = () => {
            if (isForBoec) {
                const count = user!.seasonBrigades.length;
                openPopout(
                    <ActionSheet
                        onClose={closePopout}
                        iosCloseItem={
                            <ActionSheetItem autoclose mode="cancel">
                                Отменить
                            </ActionSheetItem>
                        }
                    >
                        {count !== 0 &&
                            user!.seasonBrigades.map(({ id, title }) => (
                                <ActionSheetItem
                                    key={`${id}-${title}`}
                                    onClick={() => onBrigadeClick(id)}
                                    autoclose
                                >
                                    {title}
                                </ActionSheetItem>
                            ))}
                        {count === 0 && (
                            <ActionSheetItem disabled={true} autoclose>
                                У вас нет отрядов
                            </ActionSheetItem>
                        )}
                    </ActionSheet>
                );
            } else {
                let count = user!.brigades.length;

                if (!onlyBrigades) {
                    count += user!.shtabs.length;
                }

                if (count > 1) {
                    openPopout(
                        <ActionSheet
                            onClose={closePopout}
                            iosCloseItem={
                                <ActionSheetItem autoclose mode="cancel">
                                    Отменить
                                </ActionSheetItem>
                            }
                        >
                            {user!.brigades.map(({ id, title }) => (
                                <ActionSheetItem
                                    key={`${id}-${title}`}
                                    onClick={() => onBrigadeClick(id)}
                                    autoclose
                                >
                                    {title}
                                </ActionSheetItem>
                            ))}
                            {!onlyBrigades &&
                                user!.shtabs.map(({ id, title }) => (
                                    <ActionSheetItem
                                        key={`${id}-${title}`}
                                        onClick={() =>
                                            onShtabClick && onShtabClick(id)
                                        }
                                        autoclose
                                    >
                                        {title}
                                    </ActionSheetItem>
                                ))}
                        </ActionSheet>
                    );
                } else {
                    !onlyBrigades &&
                        onShtabClick &&
                        user!.shtabs.length > 0 &&
                        onShtabClick(user!.shtabs[0].id);
                    user!.brigades.length > 0 &&
                        onBrigadeClick(user!.brigades[0].id);
                }
            }
        };

        return children({
            handleClick,
        });
    }
);
