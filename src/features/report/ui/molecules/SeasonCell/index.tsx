import {
  ActionSheet,
  ActionSheetItem,
  ScreenSpinner,
  SimpleCell,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useMutation } from "react-query";
import { useRouter } from "react-router5";
import { LazyListContext } from "../../../../../ui/organisms/LazyList";
import { appStore } from "../../../../stores/app-store";
import { routerStore } from "../../../../stores/router-store";
import { Season } from "../../../../types";
import { ReportAPI } from "../../../../utils/requests/reports-requests";

interface SeasonCellProps {
  season: Season;
}
export const SeasonCell: FC<SeasonCellProps> = observer(({ season }) => {
  const { refetch } = useContext(LazyListContext);
  const { closePopout, openPopout } = useContext(routerStore);
  const { isStaff } = useContext(appStore);
  const { navigate } = useRouter();
  const { mutate } = useMutation(
    (formData: Partial<Season>) => {
      openPopout(<ScreenSpinner />);
      return ReportAPI.updateSeason(season.reports[0].id, season.id, formData);
    },
    {
      onSuccess: () => {
        closePopout();
        refetch();
      },
    }
  );
  const { mutate: deleteMutate } = useMutation(
    () => {
      openPopout(<ScreenSpinner />);
      return ReportAPI.deleteSeason(season.reports[0].id, season.id);
    },
    {
      onSuccess: () => {
        closePopout();
        refetch();
      },
    }
  );
  const openBoec = () => {
    navigate("else.boec.details", { boecId: season.boec.id });
  };
  const handleOpenActionSheet = (elementRef: Element) => {
    openPopout(
      <ActionSheet
        onClose={closePopout}
        iosCloseItem={
          <ActionSheetItem autoclose mode="cancel">
            Отменить
          </ActionSheetItem>
        }
        toggleRef={elementRef}
      >
        {season.state === "initial" && (
          <ActionSheetItem
            autoclose
            onClick={() =>
              mutate({
                state: "accepted",
              })
            }
          >
            Подтвердить
          </ActionSheetItem>
        )}
        <ActionSheetItem autoclose onClick={openBoec}>
          Перейти на страницу
        </ActionSheetItem>
        {season.state === "rejected" && (
          <ActionSheetItem
            autoclose
            onClick={() =>
              mutate({
                state: "accepted",
              })
            }
          >
            Выезд зачтен
          </ActionSheetItem>
        )}
        {season.state === "accepted" && (
          <ActionSheetItem
            autoclose
            onClick={() =>
              mutate({
                state: "rejected",
              })
            }
          >
            Выезд не зачтен
          </ActionSheetItem>
        )}
        {isStaff && (
          <ActionSheetItem
            mode="destructive"
            autoclose
            onClick={() => deleteMutate()}
          >
            Удалить
          </ActionSheetItem>
        )}
      </ActionSheet>
    );
  };
  return (
    <SimpleCell
      key={season.id}
      onClick={(event) => handleOpenActionSheet(event.currentTarget)}
      after={season.state !== "accepted" ? "Не зачтен" : "Зачтен"}
      description={
        season.state === "initial" ? <i> - не подтвержденный</i> : null
      }
    >
      {season.boec.fullName}
    </SimpleCell>
  );
});
