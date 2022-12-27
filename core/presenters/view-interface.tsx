import { ElementType } from "react";

// TODO: What is the correct default type for props?
class NovaViewInterface<P = Record<string, unknown>> {
  Component: ElementType;
  props: P;

  constructor(Component: ElementType, props: P = {}) {
    this.Component = Component;
    this.props = props;
  }

  render() {
    const Component = this.Component;
    const props = this.props;

    return <Component {...props} />;
  }
}

export default NovaViewInterface;
