import { hydrateRoot } from "react-dom/client";
// This comes from the app; add a configuration option to change which file is loaded in the future.
import App from "~/app/index.tsx";

hydrateRoot(document, <App />);
