import React, { useEffect, useContext, useState } from "react";
import socket from "../socket";
import styles from '../scss/dashboard.module.scss'
import { SocketIDContext } from "../context/SocketIDContext";
import Chat from "./Chat";
import Video from "./Video";

const Dashboard = (props) => {

    // Getting Context State
    const { users, name, userID, updateUsers, updateSocketID } = useContext(SocketIDContext);
    // Setting Component states
    const [selected, setSelected] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [screen, setScreen] = useState();



    useEffect(() => {
        socket.on("user connected", (user) => {
            updateSocketID(user.socketID)
            initReactivePropertiesWithSelfUpdate(user);
            users.push(user);
            updateUsers(users);
            console.log(users);
        });

        socket.on("connect", () => {
            users.forEach((user) => {
              if (user.self) {
                user.connected = true;
              }
            });
            updateUsers(users);
          });
          
          socket.on("disconnect", () => {
             users.forEach((user) => {
              if (user.self) {
                user.connected = false;
              }
            });
            updateUsers(users);
            console.log(users);
          });
          
    })

    const updateSelected = (user) => {
        if (!user.self ) {
            setSelected(true);
            user.selected = true;
            users.forEach((elem) => {
                if (elem.userID === user.userID) {
                    elem.selected = true
                } else elem.selected = false
            })
            setSelectedUser(user);
            updateUsers(users);
        }
    }

    const initReactivePropertiesWithSelfUpdate = (user) => {
        user.connected = true;
        user.messages = [];
        user.hasNewMessages = false;
        user.selected = false;
    };

    const loadScreen = (screen) => {
        if (selected) {
            setScreen(screen)

        } else {
            alert("Select a user")
        }
    }

    

    return (
        (screen == 0) ? <Chat selectedUser={ selectedUser} /> :
            (screen == 1) ? <Video  selectedUser={ selectedUser}/> :
                <div className={styles.dashboard}>
                    <div className={styles.container}>
                        <div className={styles.row}>
                            <ul className={styles.list}>
                                {users.map((user, ind) => (
                                    <li
                                        className={`${(user.self) ? styles.currentUser : ''} ${(user.selected) ? styles.selected : styles.notSelected}`}
                                        key={ind}
                                        onClick={() => updateSelected(user)}>{user.name}</li>
                                ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.row}>
                            <ul className={styles.list}>
                                <p><button onClick={() => loadScreen(0)} > Chat </button></p>
                                <p><button onClick={() => loadScreen(1)} > Video Call </button></p>
                            </ul>
                        </div>
                    </div>
                </div>
    )

};

export default Dashboard;