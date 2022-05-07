import {
    FormLayout,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelProps,
    Progress,
    ScreenSpinner,
    Title
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
import { joiResolver } from "@hookform/resolvers/joi";

import Joi from "joi";

const ApplySchema = Joi.object({
    lastName: Joi.string().required().messages({
        "any.required": "Это поле необходимо заполнить",
        "string.empty": "Это поле необходимо заполнить"
    }),
    firstName: Joi.string().required().messages({
        "any.required": "Это поле необходимо заполнить",
        "string.empty": "Это поле необходимо заполнить"
    }),
    university: Joi.string().required().messages({
        "any.required": "Это поле необходимо заполнить",
        "string.empty": "Это поле необходимо заполнить"
    }),
    about: Joi.string().required().messages({
        "any.required": "Отряду нужно знать кто ты",
        "string.empty": "Отряду нужно знать кто ты"
    }),
    phone: Joi.string().messages({
        "any.required": "Это поле необходимо заполнить",
        "string.empty": "Это поле необходимо заполнить"
    }),
    phoneLess: Joi.bool()
})
    .when(
        Joi.object({
            phoneLess: Joi.valid(false)
        }).unknown(true),
        {
            then: Joi.object({
                phone: Joi.string().required()
            })
        }
    )
    .unknown(true);

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
        percent: 10
    },
    1: {
        title: "Еще немного...",
        percent: 50
    },
    2: {
        title: "Последний шаг",
        percent: 90
    }
};
interface StepContext {
    setStep: (step: Step) => void;
}
export const stepContext = createContext<StepContext>({
    setStep: () => undefined
});

export const ApplyPanel: FC<PanelProps> = observer(props => {
    const { userData } = useContext(appStore);
    const { openPopout, closePopout } = useContext(routerStore);
    const { navigate } = useRouter();
    const [step, setStep] = useState<Step>(0);
    const form = useForm<ApplyForm>({
        mode: "onChange",
        resolver: joiResolver(ApplySchema)
    });

    useEffect(() => {
        openPopout(<ScreenSpinner />);
        if (userData) {
            form.reset({
                firstName: userData.first_name,
                lastName: userData.last_name
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
        university
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
                vkId: userData?.id
            });
            await queryClient.refetchQueries(["user-me"]);
            navigate("else.base.base");
        } finally {
            closePopout();
        }
    };
    const goBack = () => {
        if (step > 0) {
            setStep(prev => (prev - 1) as Step);
        } else {
            window.history.back();
        }
    };

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
