import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { AppContext, AppContextType } from "context/AppContext";

const SocketWrapper = (): JSX.Element => {
    const { connectSocket, isConnected } = useContext(AppContext) as AppContextType;

    useEffect(() => {
        if(!isConnected) connectSocket();
    }, [])
     
    return isConnected ? <Outlet /> : <>...loading</>
}

export default SocketWrapper
