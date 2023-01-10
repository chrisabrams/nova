import NovaPresenter from "~/core/presenters/index.ts";
import ViewHelloData from "../views/hello-data.tsx";
import ViewHomepage from "../views/index.tsx";
import ViewModelHelloData, {
  viewModelProps,
} from "../view-models/hello-data.ts";

const presenter = NovaPresenter.create("site-presenter");

presenter.view("index", ViewHomepage).viewModelProps(viewModelProps);
presenter.view("hello-data", ViewHelloData).viewModel(ViewModelHelloData);

export default presenter;
