import React, { createContext, useState } from 'react';

export const SocketIDContext = createContext();


const SocketIDContextProvider = (props) => {
    const [name, setName] = useState("");
    const [userID, setUserID] = useState("");
    const [users, setUsers] = useState([]);
    const [socketID, setSocketID] = useState("");

    const updateName = (name) => {
        setName(name);
    }
    const updateUsers = (user) => {
        setUsers([...user]);
    }
    const updateUserID = (userID) => {
        setUserID(userID);
    }
    const updateSocketID = (socketID) => {
        setSocketID(socketID);
    }

    return (
        <SocketIDContext.Provider value={{name, userID, users, socketID, updateName, updateUsers, updateUserID, updateSocketID}}>
            {props.children}
        </SocketIDContext.Provider>
    )
}

export default SocketIDContextProvider;