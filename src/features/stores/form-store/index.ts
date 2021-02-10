import { types } from "mobx-state-tree";

interface FormData {
  [key: string]: any;
}

export const FormStore = types
  .model("FormStore", {
    forms: types.frozen<{ [propName: string]: FormData }>({}),
  })
  .actions((self) => ({
    setFormData(form: string, data: FormData) {
      self.forms = {
        ...self.forms,
        [form]: data,
      };
    },
  }));
