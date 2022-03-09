import {
  Button,
  FormItem,
  FormLayout,
  Input,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner,
  PanelProps,
  CustomSelectOptionInterface,
  Group,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import React, { FC, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useRoute } from "react-router5";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { LazySelect } from "../../../ui/organisms/LazySelect";
import { routerStore } from "../../stores/router-store";

import { Brigade } from "../../types";
import { BrigadesAPI } from "../../utils/requests/brigades-request";
import { UsersAPI } from "../../utils/requests/user-request";

interface FormDataType {
  brigade: CustomSelectOptionInterface;
  year: string;
  employer: string;
}
export const BoecSeasonPanel: FC<PanelProps> = observer(({ id }) => {
  const { openPopout, closePopout } = useContext(routerStore);
  // const { user } = useContext(appStore);
  const { route } = useRoute();
  const { boecId } = useMemo(() => route.params, [route]);
  const queryClient = useQueryClient();

  const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

  const { handleSubmit, control, formState } = useForm<FormDataType>({
    defaultValues: {
      year: new Date().getFullYear().toString(),
    },
    mode: "onChange",
  });

  const { isDirty, isValid } = formState;

  const onSubmit = async (values: FormDataType) => {
    openPopout(<ScreenSpinner />);
    await UsersAPI.createNewSeason({
      boecId,
      report: {
        brigadeId: values.brigade.value as number,
        year: Number(values.year),
        employer: values.employer,
      },
    }).finally(closePopout);
    queryClient.refetchQueries(["seasons", boecId]);

    window.history.back();
    setSnackBar(<SuccessSnackbar onClose={() => setSnackBar(null)} />);
  };

  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}
      >
        Сезон
      </PanelHeader>
      <Group>
        <FormLayout onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="brigade"
            rules={{ required: "Это поле необходимо заполнить" }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Отряд"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState?.error?.message}
              >
                <LazySelect
                  name={field.name}
                  onChange={field.onChange}
                  value={field.value}
                  fetchFn={BrigadesAPI.getBrigadesList}
                  queryKey={"brigade-list"}
                  parseItem={(brigade: Brigade) => ({
                    label: brigade.fullTitle,
                    value: brigade.id,
                  })}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="year"
            rules={{
              required: "Это поле необходимо заполнить",
              max: new Date().getFullYear(),
              min: 1958,
            }}
            render={({ field, fieldState }) => (
              <FormItem
                top="Год"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState.error && fieldState.error.message}
              >
                <Input
                  type="number"
                  placeholder="Не указан"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  max={new Date().getFullYear()}
                />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name="employer"
            render={({ field, fieldState }) => (
              <FormItem
                top="Работодатель"
                status={fieldState.invalid ? "error" : "default"}
                bottom={fieldState?.error?.message}
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
          <FormItem>
            <Button
              size="l"
              stretched={true}
              disabled={!isDirty || !isValid}
              type="submit"
            >
              Сохранить
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
      {SnackBar}
    </Panel>
  );
});
