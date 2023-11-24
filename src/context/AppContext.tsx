import React, { useEffect, useState } from "react";

import axios, { AxiosRequestConfig } from "axios";
import { io, Socket } from 'socket.io-client';

import { UserCredentials, UserDoc } from "interface/UserCredentials";
import { ErrorResponse } from "interface/ErrorResponse";
import { useSessionStorage } from "usehooks-ts";

export const AppContext = React.createContext<AppContextType | null>(null);

export type AppContextType = {
    socket: Socket;
    isConnected: boolean;

    connectSocket: () => void;
    disconnectSocket: () => void;
    joinRoom: (roomID: string) => void;

    jwtToken: string | null;
    userDoc: UserDoc | null;

    auth: () => Promise<void>;
    editProfile: (newData: UserDoc, keysToEdit: Array<keyof UserDoc>) => Promise<boolean>;
    getUserDoc: (username: string) => Promise<UserDoc | null>;
    login: (credentials: UserCredentials) => Promise<ErrorResponse | null>;
    signUp: (credentials: UserCredentials) => Promise<ErrorResponse | null>;
    signOut: () => void;
}

export const AppContextProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [ socket ] = useState<Socket>(() => io('ws://localhost:8080', { autoConnect: false }));
    const [userDoc, setUserDoc] = useState<UserDoc | null>(null);

    const [jwtToken, setJwtToken] = useSessionStorage<string | null>("jwtToken", null);

    useEffect(() => {
        if(socket.hasListeners("connect") || socket.hasListeners("disconnect")) return;
        
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        }
    }, []);

    const connectSocket = () => socket.connect();
    const disconnectSocket = () => socket.disconnect();

    const joinRoom = (roomID: string) => {
        socket.emit("join-room", roomID);
    }

    const auth = async () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if(!apiUrl) throw new Error("env error");

        if (!jwtToken) return;
        
        const config: AxiosRequestConfig = {
            url: `${apiUrl}/auth`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }

        const userDocOrNull = await axios(config)
            .then(res => res.data as UserDoc)
            .catch(err => {console.error(err); return null})
        setUserDoc(userDocOrNull);
    }

    const editProfile = async (newData: UserDoc, keysToEdit: Array<keyof UserDoc>):Promise<boolean>  => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if(!apiUrl) throw new Error("env error");

        if (!jwtToken) return false;

        const config: AxiosRequestConfig = {
            url: `${apiUrl}/edit-profile`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            data: {
                userData: newData,
                keys: keysToEdit
            }
        }

        const newUserDocOrNull = await axios(config)
            .then(res => res.data as UserDoc)
            .catch(err => {console.error(err.response); return null})
        
        if (!newUserDocOrNull) return false;    
        setUserDoc(newUserDocOrNull);
        return true;
    }

    const getUserDoc = async (username: string): Promise<UserDoc | null> => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if(!apiUrl) throw new Error("env error");

        if (!username) return null;

        const config: AxiosRequestConfig = {
            url: `${apiUrl}/get-user-doc`,
            method: "POST",
            data: {
                username: username
            }
        }

        const userDocOrNull = await axios(config)
            .then(res => res.data as UserDoc | null)
            .catch(err => { console.error(err.message); return null })

        return userDocOrNull;    
    }

    type SignResponse = { user: UserDoc; token: string; }

    const login = async (credentials: UserCredentials): Promise<ErrorResponse | null> => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if(!apiUrl) throw new Error("env error");

        const config: AxiosRequestConfig = {
            url: `${apiUrl}/login`,
            method: "POST",
            data: credentials
        }

        let error: ErrorResponse | null = null;

        const response = await axios(config)
            .then(res => res.data as SignResponse)
            .catch(err => {
                console.error(err.response);
                error = err.response.data as ErrorResponse;
                return null 
            });

        if(error || !response) return error;
        setJwtToken(response.token);
        setUserDoc(response.user);
        return error;
    }

    const signUp = async (credentials: UserCredentials): Promise<ErrorResponse | null> => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if(!apiUrl) throw new Error("env error");

        const config: AxiosRequestConfig = {
            url: `${apiUrl}/signup`,
            method: "POST",
            data: credentials
        }

        let error: ErrorResponse | null = null;

        const response = await axios(config)
            .then(res => res.data as SignResponse)
            .catch(err => {
                console.error(err.response);
                error=err.response.data as ErrorResponse;
                return null 
            });  
        if (error || !response) return error;
        setJwtToken(response.token);
        setUserDoc(response.user); 
        return null;
    }

    const signOut = () => {
        setUserDoc(null);
        setJwtToken(null);
        sessionStorage.removeItem("jwtToken");
        window.location.href = "/login";
    }

    const provider = {
        socket,
        isConnected,

        connectSocket,
        disconnectSocket,
        joinRoom,

        jwtToken,
        userDoc,

        auth,
        editProfile,
        getUserDoc,
        login,
        signUp,
        signOut
    }

    return (
        <AppContext.Provider value={provider}>
            {children}
        </AppContext.Provider>
    )
}