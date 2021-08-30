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
import { routerStore } from "../../../../stores/router-store";
import { Seasons } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";

interface SeasonCellProps {
  season: Seasons;
}
export const SeasonCell: FC<SeasonCellProps> = observer(({ season }) => {
  const { refetch } = useContext(LazyListContext);
  const { closePopout, openPopout } = useContext(routerStore);
  const { navigate } = useRouter();
  const { mutate } = useMutation(
    (formData: Partial<Seasons>) => {
      openPopout(<ScreenSpinner />);
      return BrigadesAPI.updateSeason(season.id, formData);
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
      return BrigadesAPI.deleteSeason(season.id);
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
  const handleOpenActionSheet = () => {
    openPopout(
      <ActionSheet
        onClose={closePopout}
        iosCloseItem={
          <ActionSheetItem autoclose mode="cancel">
            Отменить
          </ActionSheetItem>
        }
      >
        {!season.isAccepted && (
          <ActionSheetItem
            autoclose
            onClick={() =>
              mutate({
                isAccepted: true,
              })
            }
          >
            Подтвердить
          </ActionSheetItem>
        )}
        {season.isCandidate && (
          <ActionSheetItem
            autoclose
            onClick={() =>
              mutate({
                isCandidate: false,
              })
            }
          >
            Не кандидат
          </ActionSheetItem>
        )}
        <ActionSheetItem autoclose onClick={openBoec}>
          Перейти на страницу
        </ActionSheetItem>
        <ActionSheetItem
          mode="destructive"
          autoclose
          onClick={() => deleteMutate()}
        >
          Удалить
        </ActionSheetItem>
      </ActionSheet>
    );
  };
  return (
    <SimpleCell
      key={season.id}
      onClick={handleOpenActionSheet}
      description={`${season.year} | ${
        season.isCandidate ? "Кандидат" : "Боец"
      }`}
    >
      {season.boec.fullName}
      {!season.isAccepted && <i> - не подтвержденный</i>}
    </SimpleCell>
  );
});
