import "../styles/main.scss";
import "../assets/boxicons-2.0.7/css/boxicons.min.css";

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools  } from '@tanstack/react-query-devtools';
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../redux/reducers";

const store = createStore(rootReducer);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnWindowFocus: false,
      // refetchOnmount: false,
      // refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Component {...pageProps} />
        <ReactQueryDevtools  initialisopen />
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
