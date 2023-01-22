import type { RouteResourcePath } from "nova/ext/pages/types.ts";

const importMapData = `
{
  "imports": {
    "react": "https://esm.sh/react?dev",
    "react-dom": "https://esm.sh/react-dom?dev",
    "react-dom/client": "https://esm.sh/react-dom/client?dev",
    "react/jsx-runtime": "https://esm.sh/react/jsx-runtime",
    "react-router-dom":
      "https://esm.sh/react-router-dom@6.6.1?dev&external=react"
  }
}
`;

let routeResourcePaths: RouteResourcePath[] = [];

const Scripts = {
  Head: () => {
    return (
      <>
        <script
          crossOrigin="anonymous"
          src="https://unpkg.com/react@18/umd/react.development.js"
        ></script>
        <script
          crossOrigin="anonymous"
          src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
        ></script>
        <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: importMapData }}
        ></script>
      </>
    );
  },
};

export default Scripts;

export function setRouteResourcePaths(paths: RouteResourcePath[]) {
  routeResourcePaths = paths;
}
