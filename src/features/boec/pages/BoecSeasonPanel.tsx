import {
  Button,
  CustomSelectOption,
  FormItem,
  FormLayout,
  Input,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner,
  Select,
  Spinner,
  PanelProps,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import React, { FC, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useRoute } from "react-router5";
import { SuccessSnackbar } from "../../../ui/molecules/SuccessSnackbar";
import { routerStore } from "../../stores/router-store";

import { Season } from "../../types";
import { BrigadesAPI } from "../../utils/requests/brigades-request";

export const BoecSeasonPanel: FC<PanelProps> = observer(({ id }) => {
  const { openPopout, closePopout } = useContext(routerStore);
  // const { user } = useContext(appStore);
  const { route } = useRoute();
  const { boecId } = useMemo(() => route.params, [route]);
  const queryClient = useQueryClient();

  const [SnackBar, setSnackBar] = useState<React.ReactNode>(null);

  const { data } = useQuery({
    queryKey: ["brigades"],
    queryFn: () => BrigadesAPI.getBrigadesList({ limit: 200 }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { handleSubmit, control, formState } = useForm<{
    brigade: string;
    year: string;
  }>({
    defaultValues: {
      brigade: undefined,
      year: new Date().getFullYear().toString(),
    },
    mode: "onChange",
  });

  const { isDirty, isValid } = formState;

  const onSubmit = async (values: Record<keyof Season, string>) => {
    openPopout(<ScreenSpinner />);
    // const additional = user?.isStaff ? { state: "accepted" } : {};
    // await BrigadesAPI.setSeason({
    //   brigadeId: Number(values.brigade),
    //   boecId: boecId!,
    //   year: Number(values.year),
    //   ...additional,
    // });
    closePopout();
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
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="brigade"
          rules={{ required: "Это поле необходимо заполнить" }}
          render={({ field, fieldState }) => (
            <FormItem
              top="Отряд"
              status={fieldState.invalid ? "error" : "default"}
              bottom={fieldState.error && fieldState.error.message}
            >
              <>
                {!data && (
                  <Spinner
                    size="small"
                    style={{
                      margin: "20px 0",
                      height: 300,
                    }}
                  />
                )}
                {data && (
                  <Select
                    name={field.name}
                    defaultValue={field.value}
                    placeholder="Не выбран"
                    options={data.items.map((user) => ({
                      label: user.title,
                      value: user.id,
                    }))}
                    onChange={field.onChange}
                    renderOption={({ option, ...restProps }) => (
                      <CustomSelectOption {...restProps} />
                    )}
                  />
                )}
              </>
            </FormItem>
          )}
        />
        <Controller
          control={control}
          name="year"
          rules={{ required: "Это поле необходимо заполнить" }}
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
      {SnackBar}
    </Panel>
  );
});
