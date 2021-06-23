import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import styles from '../scss/dashboard.module.scss'

const Dashboard = (props) => {
  const [socketID, setSocketID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [userID, setUserID] = useState();
  const [users, setUsers] = useState([]);


  useEffect(() => {
        setUsers(props.location.state.users);

        socket.on("user connected", (user) => {
            initReactiveProperties(user);
            users.push(user);
        
            console.log(users);
            })
    })

    const initReactiveProperties = (user) => {
        user.connected = true;
        user.messages = [];
        user.hasNewMessages = false;
      };

  return (
    <div className={styles.container}>
       <div>
           users.map((user, ind) => (


           )
           )
       </div>
    </div>
  )

};

export default Dashboard;