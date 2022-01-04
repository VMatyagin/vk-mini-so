import { Icon24Done } from "@vkontakte/icons";
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  PanelHeaderButton,
  IOS,
  Group,
  FormItem,
  ViewWidth,
  useAdaptivity,
  usePlatform,
  FormLayout,
  Input,
  Checkbox,
  ScreenSpinner,
} from "@vkontakte/vkui";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRoute } from "react-router5";
import { RouterStoreInstance } from "../../../stores/router-store";
import { Nomination } from "../../../types";
import { EventAPI } from "../../../utils/requests/event-request";

export const MODAL_EVENT_NOMINATION_EDIT = "MODAL_EVENT_NOMINATION_EDIT";

export const NominationEditModal = () => {
  const { closeModal, modalCallback, openPopout, closePopout, activeModal } =
    RouterStoreInstance;
  const { route } = useRoute();

  const { competitionId, nominationId, eventId } = useMemo(
    () => route.params,
    [route]
  );

  const platform = usePlatform();
  const { viewWidth = 100 } = useAdaptivity();
  const isMobile = viewWidth <= ViewWidth.MOBILE;
  const { mutate } = useMutation<Nomination, Error, Nomination>(
    (nomination) => {
      openPopout(<ScreenSpinner />);
      if (nominationId) {
        return EventAPI.updateCompetitionNomination({
          competitionId: competitionId!,
          nomination,
        });
      }
      return EventAPI.createCompetitionNomination({
        competitionId: competitionId!,
        nomination,
      });
    },
    {
      onSuccess: () => {
        reset({ isRated: true });
        closePopout();
        modalCallback[MODAL_EVENT_NOMINATION_EDIT]();
        closeModal();
      },
    }
  );
  const onNominationSelect = (values: Nomination) => {
    mutate(values);
  };
  const handleClose = () => {
    closeModal();
    reset({ isRated: true });
  };

  useQuery({
    queryKey: ["nomination", nominationId],
    queryFn: () => {
      return EventAPI.getCompetitionNomination({
        competitionId: competitionId!,
        nominationId: nominationId!,
      });
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!nominationId,
    onSuccess: (data) => {
      reset(data);
    },
  });

  const { handleSubmit, control, formState, reset, watch } =
    useForm<Nomination>({
      mode: "onChange",
      defaultValues: {
        isRated: true,
      },
    });

  useEffect(() => {
    return () => {
      reset({});
    };
  }, [reset]);
  const { isDirty, isValid } = formState;

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ queryKey }) => {
      return EventAPI.getEvent(queryKey[1] as number);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: activeModal === MODAL_EVENT_NOMINATION_EDIT,
  });

  return (
    <ModalPage
      id={MODAL_EVENT_NOMINATION_EDIT}
      settlingHeight={100}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={handleClose} />}
          right={
            !(!isDirty || !isValid) && (
              <PanelHeaderButton onClick={() => onNominationSelect(watch())}>
                {platform === IOS ? "Готово" : <Icon24Done />}
              </PanelHeaderButton>
            )
          }
        >
          {nominationId ? "Редактирование" : "Создание"}
        </ModalPageHeader>
      }
      onClose={handleClose}
    >
      <Group style={{ minHeight: 300 }}>
        <FormLayout onSubmit={handleSubmit(onNominationSelect)}>
          <Controller
            control={control}
            name="title"
            rules={{
              required: "Это поле необходимо заполнить",
            }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Название"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <Input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormItem>
            )}
          />
          {event?.worth === 2 && (
            <Controller
              control={control}
              name="sportPlace"
              rules={{
                required: "Это поле необходимо заполнить",
              }}
              render={({ field, fieldState }) => (
                <FormItem
                  top="Спортивное место"
                  status={fieldState.invalid ? "error" : "default"}
                  bottom={fieldState.error && fieldState.error.message}
                >
                  <Input
                    type="number"
                    name={field.name}
                    value={field.value?.toString()}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormItem>
              )}
            />
          )}
          <Controller
            control={control}
            name="isRated"
            render={({ field, fieldState }) => (
              <FormItem
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <Checkbox
                  name={field.name}
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  Рейтинговая номинация?
                </Checkbox>
              </FormItem>
            )}
          />
        </FormLayout>
      </Group>
    </ModalPage>
  );
};
