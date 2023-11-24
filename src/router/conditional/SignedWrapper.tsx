import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AppContext, AppContextType } from "context/AppContext";
import { UserDoc } from "interface/UserCredentials";

const SignedWrapper = () => {
    const { getUserDoc } = useContext(AppContext) as AppContextType;
    const [loading, setLoading] = useState<boolean>(true);
    const [pass, setPass] = useState<boolean>(false);

    const fetchData = async (): Promise<UserDoc | null> => {
        const userOrNull = await getUserDoc();
        return userOrNull;
    }

    useEffect(() => {
        fetchData()
            .then((res) => setPass(res ? true : false))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <>...</>
    if (!pass) return <Navigate to="/login" replace />
    return <Outlet />
}

export default SignedWrapper
