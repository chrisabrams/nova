import Layout from "./layouts/default/index.tsx";
import Scripts from "nova/core/app/scripts/index.tsx";
import type { NovaApp } from "nova/core/app/types.ts";

function App({ children }: NovaApp) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nova</title>
        <Scripts.Head />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

export default App;
