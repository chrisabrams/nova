import { ElementType } from "react";

// TODO: What is the correct default type for props?
class NovaViewInterface<P = Record<string, unknown>> {
  Component: ElementType;
  props: P;

  // @ts-expect-error props might be a different type -- how to fix?
  constructor(Component: ElementType, props: P = {}) {
    this.Component = Component;
    this.props = props;
  }

  // @ts-expect-error props might be a different type -- how to fix?
  static create(Component: ElementType, props: P = {}) {
    return new NovaViewInterface(Component, props);
  }

  render() {
    const Component = this.Component;
    const props = this.props;

    return <Component {...props} />;
  }
}

export default NovaViewInterface;
