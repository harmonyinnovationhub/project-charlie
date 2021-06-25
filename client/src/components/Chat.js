import React, { useState, useEffect, useContext, useRef } from "react";
import styles from '../scss/chat.module.scss'
import socket from "../socket";
import { SocketIDContext } from "../context/SocketIDContext";

const Chat = (props) => {
  const [socketID, setSocketID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
 
  const {users, name, userID, updateUsers, updateName, updateUserID, updateSocketID} = useContext(SocketIDContext);


  useEffect(() => {
    socket.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    })
  }, []);
  
  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: socketID,
    };
    setMessage("");
    console.log(messageObject);
    socket.emit("send message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {messages.map((message, index) => {
          if (message.id === socketID) {
            return (
              <div key={index} className={styles.myRow}>
                <div className={styles.myMessage}>
                  {message.body}
                </div>
              </div>
            )
          }
          return (
            <div key={index} className={styles.partnerRow}>
              <div className={styles.partnerMessage}>
                {message.body}
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={sendMessage}>
        <textarea value={message} onChange={handleChange} placeholder="Say something..." />
        <button>Send</button>
      </form>

      <div>
          {/* <button onClick={}>Call</button> */}
      </div>
    </div>
  );
};

export default Chat;