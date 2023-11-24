import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AppContext, AppContextType } from "context/AppContext";

const UnsignedWrapper = (): JSX.Element => {
    const { jwtToken } = useContext(AppContext) as AppContextType;

    if (!jwtToken) return <Outlet />

    return <Navigate to="/" replace />
}

export default UnsignedWrapper;
