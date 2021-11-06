import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/layout/PageLayout";
import { ProfileData } from "./components/ProfileData";
import { SignInButton } from "./components/SignInButton";
import AllMediaPage from "./pages/AllMediaPage";
import AdminPage from "./pages/AdminPage";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import { callMsGraph } from "./graph";
import Button from "react-bootstrap/Button";
import "./styles/App.css";

const MainContent = () => {    
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <Routes>
                    <Route path='/' exact element={<HomePage />}/>
                    <Route path='/media' element={<AllMediaPage />}/>
                    <Route path='/account' element={<AccountPage />}/>
                    <Route path='/admin' element={<AdminPage />}/>
                </Routes>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">This will be a splash page for Book'd.</h5>
                <SignInButton />
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
