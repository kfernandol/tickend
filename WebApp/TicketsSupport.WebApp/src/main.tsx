import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.tsx";
import { PersistGate } from "redux-persist/integration/react";
import RoutesGuard from "./components/routesGuard/routesGuard.tsx";
//css and scss
import "./index.css";
//PrimeReact
import "primeicons/primeicons.css";
import "./assets/scss/customPrimeFlex.scss"
import "primereact/resources/primereact.css";
//Themes
//primereact/resources/themes/vela-blue/theme.css
//primereact/resources/themes/lara-dark-blue/theme.css
//primereact/resources/themes/luna-blue/theme.css
//import "primereact/resources/themes/vela-blue/theme.css";
//i18n
import "./assets/themes/tickend-light/theme.css"
import { LanguageComponent } from "./i18n.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <PrimeReactProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <LanguageComponent>
                    <RoutesGuard />
                </LanguageComponent>
            </PersistGate>
        </Provider>
    </PrimeReactProvider>
);
