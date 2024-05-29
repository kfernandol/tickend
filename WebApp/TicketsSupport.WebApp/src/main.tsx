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
import "./assets/themes/tickend-light/theme.css"
//i18n
import "./assets/themes/tickend-light/theme.css"
import { LanguageComponent } from "./i18n.tsx";
//google
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <PrimeReactProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GoogleOAuthProvider clientId="534920013394-ltiprmdh3a9g11bfnb9t02ne9tcvasf8.apps.googleusercontent.com">
                    <LanguageComponent>
                        <RoutesGuard />
                    </LanguageComponent>
                </GoogleOAuthProvider>
            </PersistGate>
        </Provider>
    </PrimeReactProvider>
);
