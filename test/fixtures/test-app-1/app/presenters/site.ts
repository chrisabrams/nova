import NovaPresenter from "nova/ext/presenters/index.ts";
import ViewHelloData from "../pages/hello-data.tsx";
import ViewHomepage from "../pages/index.tsx";
import ViewModelHelloData, {
  viewModelProps,
} from "../view-models/hello-data.ts";

const presenter = NovaPresenter.create("site-presenter");

presenter.view("index", ViewHomepage).viewModelProps(viewModelProps);
presenter.view("hello-data", ViewHelloData).viewModel(ViewModelHelloData);

export default presenter;
