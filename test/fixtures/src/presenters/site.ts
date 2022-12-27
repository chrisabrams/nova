import NovaPresenter from "~/core/presenters/index.ts";
import ViewHomepage from "../views/index.tsx";

const presenter = NovaPresenter.create("site-presenter");

presenter.defineView("index", ViewHomepage);

export default presenter;
