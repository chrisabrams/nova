import type { NovaViewInterfaceProps } from "../presenters/types.ts";
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

  defineProps<T>(handler: NovaViewModelHandler<T>) {
    // return handler({ ctx: {} });
    this.handler = handler;

    /*
    return {
      async getProps() {
        const props = await handler({ ctx: {} });

        _this.props = props;

        return props;
      },
    };
    */
    return {
      getProps: () => {
        return this.getProps() as Promise<T>;
      },
    };
  }

  async getProps() {
    const props = await this.handler({ ctx: {} });

    this.props = props;

    return props;
  }
}

export default NovaViewModel;
