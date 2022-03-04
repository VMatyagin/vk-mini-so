import {
  FormLayout,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelProps,
  Progress,
  ScreenSpinner,
  Title,
} from "@vkontakte/vkui";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { appStore } from "../../../features/stores/app-store";
import { UserApply } from "../../../features/types";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { ApplyAPI } from "../../../features/utils/requests/apply-request";
import { routerStore } from "../../../features/stores/router-store";
import { useRouter } from "react-router5";
import { useQueryClient } from "react-query";

interface ApplyForm extends Omit<UserApply, "areaId" | "brigadeId"> {
  brigadeId: { label: string; value: number };
}
type Step = 0 | 1 | 2;

interface State {
  title: string;
  percent: number;
}
const stepValues: Record<Step, State> = {
  0: {
    title: "Привет!",
    percent: 10,
  },
  1: {
    title: "Еще немного...",
    percent: 50,
  },
  2: {
    title: "Последний шаг",
    percent: 90,
  },
};
interface StepContext {
  setStep: (step: Step) => void;
}
export const stepContext = createContext<StepContext>({
  setStep: () => undefined,
});

export const ApplyPanel: FC<PanelProps> = observer((props) => {
  const { userData } = useContext(appStore);
  const { openPopout, closePopout } = useContext(routerStore);
  const { navigate } = useRouter();
  const [step, setStep] = useState<Step>(0);
  const form = useForm<ApplyForm>({
    mode: "onChange",
  });
  console.log(form.watch());

  useEffect(() => {
    openPopout(<ScreenSpinner />);
    if (userData) {
      form.reset({
        firstName: userData.first_name,
        lastName: userData.last_name,
      });
      closePopout();
    }
  }, [closePopout, form, openPopout, userData]);

  const { handleSubmit } = form;
  const queryClient = useQueryClient();
  const onSubmit = async ({
    about,
    firstName,
    lastName,
    brigadeId,
    dateOfBirth,
    middleName,
    phone,
    university,
  }: ApplyForm) => {
    openPopout(<ScreenSpinner />);
    try {
      await ApplyAPI.createApply({
        about,
        firstName,
        lastName,
        brigadeId: brigadeId?.value,
        dateOfBirth: dateOfBirth || null,
        middleName,
        phone,
        university,
        vkId: userData?.id,
      });
      await queryClient.refetchQueries(["user-me"]);
      navigate("else.base.base");
    } finally {
      closePopout();
    }
  };
  const goBack = () => {
    if (step > 0) {
      setStep((prev) => (prev - 1) as Step);
    } else {
      window.history.back();
    }
  };
  useEffect(() => {
    const callback = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener("touchmove", callback, {
      passive: false,
    });
    return () => {
      document.removeEventListener("touchmove", callback);
    };
  }, []);
  console.log(form.formState.errors);

  return (
    <Panel {...props}>
      <PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
        <Title level="2" weight="bold">
          {stepValues[step].title}
        </Title>
      </PanelHeader>
      <Progress value={stepValues[step].percent} />
      <stepContext.Provider value={{ setStep }}>
        <FormProvider {...form}>
          <FormLayout onSubmit={handleSubmit(onSubmit)}>
            {step === 0 && <StepOne />}
            {step === 1 && <StepTwo />}
            {step === 2 && <StepThree />}
          </FormLayout>
        </FormProvider>
      </stepContext.Provider>
    </Panel>
  );
});
