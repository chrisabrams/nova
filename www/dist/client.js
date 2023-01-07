// ../core/app/bootstrap/client.tsx
import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client?dev";

// app/index.tsx
import { jsx, jsxs } from "https://esm.sh/react@18.2.0/jsx-runtime?dev";
function App({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("title", { children: "Nova" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("div", { children: "hello world" }),
      children
    ] })
  ] });
}
var app_default = App;

// ../core/app/bootstrap/client.tsx
import { jsx as jsx2 } from "https://esm.sh/react@18.2.0/jsx-runtime?dev";
hydrateRoot(document, /* @__PURE__ */ jsx2(app_default, {}));
