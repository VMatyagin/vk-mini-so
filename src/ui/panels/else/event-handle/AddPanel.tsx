import React, { FC } from "react";
import { PanelHeader, Title, PanelHeaderBack } from "@vkontakte/vkui";
import { useMst } from "../../../../features/stores";
import { PanelTemplate } from "../../template/PanelTemplate";
export const AddPanel: FC<{ id: string }> = ({ id }) => {
    const store = useMst();
    return (
        <PanelTemplate id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={store.router.goBack} />}
            >
                <Title level="2" weight="bold">
                    Новое мероприятие
                </Title>
            </PanelHeader>
            {/* <FormLayout>
                <Input top="Название" name="name" />
                <Input top="Место проведения" name="place" />
                <Input type="date" top="Дата" name="date" />
                <Input type="time" top="Время" name="time" />
                <Select placeholder="Выберите уровень / штаб">
                    <option value="spbso">Городское</option>
                    <option value="spbstu">СПбПУ Петра Великого</option>
                </Select>
                <Checkbox>
                    Согласен с <Link>этим</Link>
                </Checkbox>
                <Button size="xl">Сохранить</Button>
            </FormLayout> */}
        </PanelTemplate>
    );
};
