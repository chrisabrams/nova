import type { ViewModelProps } from "../view-models/hello-data.ts";

import type { NovaViewProps } from "nova/core/views/types.ts";

function HelloDataPage({ name }: NovaViewProps<ViewModelProps>) {
  return <div>Hello {name}</div>;
}

export default HelloDataPage;
