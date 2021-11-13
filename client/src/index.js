import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./store/user-context";
import { RentalsContextProvider } from "./store/rentals-context";
import { SearchContextProvider } from "./store/search-context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import App from "./App.jsx";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 * We recommend initializing this outside of your root component to ensure it is not re-initialized on re-renders
 */
const msalInstance = new PublicClientApplication(msalConfig);
require("dotenv").config();


/**
 * We recommend wrapping most or all of your components in the MsalProvider component. It's best to render the MsalProvider as close to the root as possible.
 */
ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <SearchContextProvider>
                <UserContextProvider>
                    <RentalsContextProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </RentalsContextProvider>
                </UserContextProvider>
            </SearchContextProvider>
        </MsalProvider>
    </React.StrictMode>,
    document.getElementById("root")
);