import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { GlobalChat, Login, SignUp } from "pages";

import { useContext } from "react";
import { AppContext } from "context/AppContext";
import { SocketWrapper, UnsignedWrapper } from "./conditional";
import UserRouter from "./UserRouter";

const AppRouter = () => {
    const context = useContext(AppContext);
    
    if(!context) return <>...loading router</>;

    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route element={<SocketWrapper />}>
                        <Route path="/" element={<GlobalChat />} />
                    </Route>
                </Route>
                <Route element={<UnsignedWrapper />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                </Route>
                <Route path="/profile" element={<UserRouter />} />
                <Route path="/profile/:username" element={<UserRouter />} />
                <Route path="*" element={ <Navigate to="/" /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;
