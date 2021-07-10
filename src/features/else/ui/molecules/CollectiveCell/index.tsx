import { Icon28UsersOutline } from "@vkontakte/icons";
import { ActionSheet, ActionSheetItem, SimpleCell } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { brigadeStore } from "../../../../brigades/store/brigadeStore";
import { shtabStore } from "../../../../shtab/store/brigadeStore";
import { appStore } from "../../../../stores/app-store";
import { routerStore } from "../../../../stores/router-store";

export const CollectiveCell = observer(() => {
    const { user } = useContext(appStore);
    const { setPage, openPopout, closePopout } = useContext(routerStore);
    const { setBrigadeId } = useContext(brigadeStore);
    const { setShtabId } = useContext(shtabStore);

    const handleClick = () => {
        const count = user!.brigades.length + user!.shtabs.length;
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
                            onClick={() => selectBrigade(id)}
                            autoclose
                        >
                            {title}
                        </ActionSheetItem>
                    ))}
                    {user!.shtabs.map(({ id, title }) => (
                        <ActionSheetItem
                            key={`${id}-${title}`}
                            onClick={() => selectShtab(id)}
                            autoclose
                        >
                            {title}
                        </ActionSheetItem>
                    ))}
                </ActionSheet>
            );
        } else {
            user!.shtabs.length > 0 && selectShtab(user!.shtabs[0].id);
            user!.brigades.length > 0 && selectBrigade(user!.brigades[0].id);
        }
    };
    const selectBrigade = (id: number) => {
        setBrigadeId(id);
        setPage("brigades", "details");
    };
    const selectShtab = (id: number) => {
        setShtabId(id);
        setPage("shtab", "base");
    };
    return (
        <SimpleCell onClick={handleClick} before={<Icon28UsersOutline />}>
            Мой коллектив
        </SimpleCell>
    );
});
