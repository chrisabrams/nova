import NovaViewModel from "nova/core/view-models/index.ts";

const viewModel = NovaViewModel.create("hello-data-view-model");

export const viewModelProps = viewModel.getProps(() => {
  return {
    name: "Dave",
  };
});

export default viewModel;

export type ViewModelProps = ReturnType<typeof viewModelProps["loadProps"]>;

/*
export type ViewModelProps = ReturnType<
  typeof viewModel.defineProps
>["getProps"];
export type ViewModelProps2 = typeof viewModelProps["getProps"];
export type ViewModelProps3 = ReturnType<typeof viewModelProps["getProps"]>;
export type ViewModelProps4 = ReturnType<
  NovaViewModel["defineProps"]
>["getProps"];
*/
