import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { PageLayout } from "./components/layout/PageLayout";
import { SignInButton } from "./components/SignInButton";
import AllMediaPage from "./pages/AllMediaPage";
import AdminPage from "./pages/AdminPage";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import "./styles/App.css";
import MediaRender from "./components/account/MediaRender";
import UserContext from "./store/user-context";
import { loginRequest } from "./authConfig";

const MainContent = () => {
    // needs logic to authenticate user role
    // TODO: GRAB USER FROM DB 
    //          PSEUDOO
    //          IF THE USER !EXISTS
    //              APPEND USER TO DB AS role = 'user'
    //       SET ACTIVEUSER IN USER CONTEXT 
    //       SET USER ROLE IN USER CONTEXT
    //

    return (
        <div className="App">
            <AuthenticatedTemplate>
                <Routes>
                    <Route path='/' exact element={<HomePage />}/>
                    <Route path='/media' element={<AllMediaPage />}/>
                      <Route path="/media/:search" element={<AllMediaPage />} />
                    <Route path='/account' element={<AccountPage />}/>
                    <Route path='/admin' element={<AdminPage />}/>
                    <Route path='/account/rental/:blob' element={<MediaRender />}/>
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
