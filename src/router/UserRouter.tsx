import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { AppContext, AppContextType } from "context/AppContext";
import { UserDoc } from "interface/UserCredentials";
import { Profile } from "pages";

const UserRouter = () => {
    const { getUserDoc, userDoc } = useContext(AppContext) as AppContextType;
    const { username } = useParams();
    const [userFetched, setUserFetched] = useState<UserDoc | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserData = async (): Promise<UserDoc | null> => {
        if (!username) return userDoc;
        if (userDoc && (username === userDoc.username)) return userDoc;
        
        const userDocOrNull = await getUserDoc(username);
        return userDocOrNull;
    }

    useEffect(() => {
        fetchUserData()
            .then(fetched => setUserFetched(fetched))
            .finally(() => setLoading(false));
    }, [username, userDoc])

    if (loading) return <>...loading</>
    if (!userFetched) return <Navigate to="/" />
    return <Profile user={userFetched} />
}

export default UserRouter;
