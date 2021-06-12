import React, { useEffect, useState } from 'react';
import socket from "./js/socket";
import VideoChat from './components/VideoChat';
import Chat from './components/Chat';
import Signin from './components/Signin';


function Charlie () {

  let [usernameAlreadySelected, setusernameAlreadySelected] = useState(false);
   
  useEffect(()=> {
    // Getting Error message returned
    socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          setusernameAlreadySelected(false);
        }
        alert("Error Username");
      });

   

  })

  // Destroying instances of connection
  useEffect(()=>{
        return ()=>{
            socket.off("connect_error");
        }
    })
  const updateUserName = (username) => {
    // We attach the username in the auth object, and then call socket.connect() to connect.
    setusernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  }



  return (  
    <div>
        {
            (!usernameAlreadySelected)?
             <Signin updateUserName = {updateUserName} />:
             <Wrapper />
        }   
        
    </div>
  )
} 


function Wrapper(){

    let [users, setUsers] = useState([]);
    let [selected, setSelected] = useState();
    const setUsersFunction = (users) => {
      setUsers(users);
    }
    const initReactiveProperties = (user) => {
        user.connected = true;
        user.messages = [];
        user.hasNewMessages = false;
      };
    const getSelection = (user) => {
      setSelected(user)
    }

    useEffect(() => {

      socket.on("connect", () => {
        users.forEach((user) => {
          if (user.self) {
            user.connected = true;
          }
        });
        setUsers(users);

      });

        // Register to handle the users event:
        socket.on("users", (users) => {
            users.forEach((user) => {
                // Assigning more properties to each user object
                user.self = user.userID === socket.id;
                initReactiveProperties(user);
            });

            // put the current user first, and then sort by username
            users = users.sort((a, b) => {
              if (a.self) return -1;
              if (b.self) return 1;
              if (a.username < b.username) return -1;
              return a.username > b.username ? 1 : 0;
            })
            setUsers(users);
        });

        // User connected handler
        socket.on("user connected", (connected_user) => {
            initReactiveProperties(connected_user);
            users.push(connected_user);
            setUsers(users);
         });

        // User disconnected handler
        socket.on("user disconnected", (id) => {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.userID === id) {
                    user.connected = false;
                    break;
                }
            }
            setUsers(users);
        });

        socket.on("disconnect", () => {
            users.forEach((user) => {
              if (user.self) {
                user.connected = false;
              }
            });
            setUsers(users);
          });

    })


    // Destroying connections and releasing resource
    useEffect(() => {
        return ()=>{
            socket.off("users");
            socket.off("disconnect");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("connect");
            socket.off("private message");
        }
    })
     

    return(
        <div>
                <div> <Chat users={users} setUsersFunction = {setUsersFunction} getSelection = {getSelection}/> </div>
                {/* <div> <VideoChat users={users} setSelected = {setSelected} /></div> */}

        </div>
    )
}
export default Charlie;
