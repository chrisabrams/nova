import type { NovaViewConfig } from "~/core/views/types.ts";

const IndexPage = () => {
  return <div>Hello world</div>;
};

export default IndexPage;

export const config: NovaViewConfig = {
  id: "homepage",
};
