import {
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
} from "@vkontakte/icons";
import {
  ActionSheet,
  ActionSheetItem,
  Footer,
  IOS,
  ScreenSpinner,
  SimpleCell,
  Spinner,
  usePlatform,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { useRoute } from "react-router5";
import { MODAL_BOEC_POSITION_SELECT } from "../../../../boec/ui/modals/LeaderPositionModal";
import { routerStore } from "../../../../stores/router-store";
import { Position } from "../../../../types";
import { BrigadesAPI } from "../../../../utils/requests/brigades-request";
import { ShtabsAPI } from "../../../../utils/requests/shtab-request";
import { positions } from "../../../helpers";

interface ShtabOrBrigadeLeadersProps {
  isEditing?: boolean;
}
export const ShtabOrBrigadeLeaders: FC<ShtabOrBrigadeLeadersProps> = observer(
  ({ isEditing }) => {
    const { openPopout, closePopout, setModalCallback, openModal } =
      useContext(routerStore);
    const {
      route,
      router: { navigate },
    } = useRoute();
    const { brigadeId, shtabId } = useMemo(() => route.params, [route]);
    const {
      data,
      isLoading: isPositionsLoading,
      refetch,
    } = useQuery({
      queryKey: [
        brigadeId ? "brigade-positions" : "shtab-positions",
        brigadeId || shtabId,
      ],
      queryFn: ({ queryKey }) => {
        if (brigadeId) {
          return BrigadesAPI.getBrigadePositions({
            brigadeId: queryKey[1] as number,
            hideLast: isEditing ? false : true,
          });
        } else {
          return ShtabsAPI.getShtabPositions({
            shtabId: queryKey[1] as number,
            hideLast: isEditing ? false : true,
          });
        }
      },
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!brigadeId || !!shtabId,
    });
    const { mutate: updatePosition } = useMutation<Position, Error, Position>(
      (data) => {
        openPopout(<ScreenSpinner />);
        if (brigadeId) {
          return BrigadesAPI.updateBrigadePosition(data);
        }
        return ShtabsAPI.updateShtabPosition(data);
      },
      {
        onSuccess: () => {
          closePopout();
          refetch();
        },
      }
    );
    const { mutate: deleteMutation } = useMutation<Position, Error, Position>(
      (data) => {
        openPopout(<ScreenSpinner />);
        if (brigadeId) {
          return BrigadesAPI.removeBrigadePosition({
            brigadeId: data.brigade.id,
            positionId: data.id,
          });
        }
        return ShtabsAPI.removeShtabPosition({
          shtabId: data.shtab.id,
          positionId: data.id,
        });
      },
      {
        onSuccess: () => {
          closePopout();
          refetch();
        },
      }
    );

    const openEditModal = (item: Position) => {
      navigate(route.name, { ...route.params, position: item });

      setModalCallback(MODAL_BOEC_POSITION_SELECT, (updatedPosition) => {
        updatePosition(updatedPosition);
      });
      openModal(MODAL_BOEC_POSITION_SELECT);
    };
    const platform = usePlatform();
    const handleOpenActionSheet = (toggleRef: Element, item: Position) => {
      openPopout(
        <ActionSheet
          onClose={closePopout}
          iosCloseItem={
            <ActionSheetItem autoclose mode="cancel">
              Отменить
            </ActionSheetItem>
          }
          toggleRef={toggleRef}
        >
          <ActionSheetItem onClick={() => openEditModal(item)} autoclose>
            Редактировать
          </ActionSheetItem>
          <ActionSheetItem
            autoclose
            before={
              platform === IOS ? (
                <Icon28DeleteOutline />
              ) : (
                <Icon28DeleteOutlineAndroid />
              )
            }
            mode="destructive"
            onClick={() => deleteMutation(item)}
          >
            Удалить
          </ActionSheetItem>
        </ActionSheet>
      );
    };
    const changeView = (boecId: number) => {
      navigate("else.boec.details", { boecId });
    };
    return (
      <>
        {isPositionsLoading && (
          <Spinner size="small" style={{ margin: "20px 0" }} />
        )}
        {data &&
          (data.length === 0 ? (
            <Footer>Ничего не найдено</Footer>
          ) : (
            data.map((item) => (
              <SimpleCell
                key={item.id}
                // description={positions[item.position].title}
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
                onClick={(event) =>
                  isEditing
                    ? handleOpenActionSheet(event.currentTarget, item)
                    : changeView(item.boec.id)
                }
              >
                {`${item.boec.fullName} | ${positions[item.position].title}`}
              </SimpleCell>
            ))
          ))}
      </>
    );
  }
);
