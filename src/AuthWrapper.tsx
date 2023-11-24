import { useContext, useEffect, useState } from "react";

import { AppContext } from "context/AppContext";

type AuthWrapperProps = {
    children: JSX.Element;
}

const AuthWrapper = ({children}: AuthWrapperProps): JSX.Element => {
    const context = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!context) return;
        context.auth()
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <>...loading</>;
    return children;
}

export default AuthWrapper