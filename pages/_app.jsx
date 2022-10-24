import "../styles/main.scss";
import "../assets/boxicons-2.0.7/css/boxicons.min.css";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../redux/reducers";

const store = createStore(rootReducer);

// document.title = "WEP Dashboard";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
