import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { SocketIDContext } from "../context/SocketIDContext";
import styles from '../scss/app.module.scss'
import socket from "../socket";
import Dashboard from "./Dashboard";

export default function Signin() {
   

    const history = useHistory();

    const {name, users, userID, socketID, updateUsers, updateName, updateUserID, updateSocketID} = useContext(SocketIDContext);
    const [authenticated, setAuthentication] = useState(true)
    
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        // Setting name authentication
        socket.auth = { name, userID };
        socket.connect();

        // Listening to getId event
        socket.on("getId", (users) => {
            users.forEach((user) => {
                user.self = (user.socketID === socket.id) ? true : false;
                initReactiveProperties(user);
              });

              // put the current user first, and then sort by username
              updateUsers(users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.name < b.name) return -1;
                return a.name > b.name ? 1 : 0;
              }) );
               setAuthentication(false);
        })

        // Listnening for connection error event
        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                alert('Error connecting')
            }
        });
    }


    const changeName = (e) => {
        updateName(e)
    }
    const changeUserID = (e) => {
        updateUserID(e)
    }
    const initReactiveProperties = (user) => {
        user.connected = true;
        user.messages = [];
        user.selected = false;
        user.hasNewMessages = false;
      };
  

    return (
        (authenticated) ? 
        ( <div className={styles.container}>
            
                <form onSubmit={handleSubmit}>
                    <input
                        value={name}
                        onChange={e => changeName(e.target.value)}
                        placeholder="Name"
                        type="text"
                        name="name"
                        required
                    />
                    <input
                        value={userID}
                        onChange={e => changeUserID(e.target.value)}
                        placeholder="ID"
                        type="text"
                        name="userID"
                        required
                    />
                <button type="submit">Submit</button>
            </form>
        </div> ) :
        <Dashboard />
    )
}

