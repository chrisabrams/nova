import type { NovaViewInterfaceProps } from "nova/ext/presenters/types.ts";
import { NovaViewModelHandler, NovaViewModelOptions } from "./types.ts";

class NovaViewModel {
  handler: NovaViewModelHandler<any> = () => ({});
  name: string;
  props: NovaViewInterfaceProps = {};

  constructor({ name, props = {} }: NovaViewModelOptions) {
    this.name = name;
    this.props = props;
  }

  static create(
    name: NovaViewModelOptions["name"],
    props: NovaViewInterfaceProps = {}
  ) {
    return new NovaViewModel({ name, props });
  }

  getProps<T>(handler: NovaViewModelHandler<T>) {
    this.handler = handler;

    return {
      loadProps: () => {
        return this.loadProps() as Promise<T>;
      },
    };
  }

  async loadProps() {
    const props = await this.handler({ ctx: {} });

    this.props = props;

    return props;
  }
}

export default NovaViewModel;
