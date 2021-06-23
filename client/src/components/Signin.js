import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from '../scss/app.module.scss'
import socket from "../socket";
import Dashboard from "./Dashboard";

export default function Signin() {
    const [name, setName] = useState("");
    const [userID, setUserID] = useState("");
    const [users, setUsers] = useState([]);
    const [auth, setAuth] = useState(false);

    const history = useHistory();

    useEffect(() => {

    })

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        // Setting name authentication
        socket.auth = { name, userID };
        socket.connect();

        // Listening to getId event
        socket.on("getId", (users) => {
            users.forEach((user) => {
                user.self = user.socketID ===  socket.id;
                initReactiveProperties(user);
              });
              // put the current user first, and then sort by username
              setUsers(users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.name < b.name) return -1;
                return a.name > b.name ? 1 : 0;
              }) )
              
              history.push({
                pathname: '/dashboard',
                search: '',
                state: { name, userID, users}
            });
        })
    
        // Listnening for connection error event
        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                alert('Error connecting')
            }
        });
    }

    

    const changeName = (e) => {
        setName(e)
    }
    const changeUserID = (e) => {
        setUserID(e)
    }
    const initReactiveProperties = (user) => {
        user.connected = true;
        user.messages = [];
        user.hasNewMessages = false;
      };
  

    return (
        <div className={styles.container}>
            
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
          
             
        </div>
    )
}

