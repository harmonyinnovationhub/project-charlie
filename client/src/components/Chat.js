import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from '../scss/chat.module.scss'

const Chat = (props) => {
  const [socketID, setSocketID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const socketRef = useRef();

  useEffect(() => {

    setName(props.location.state.name);
    
    setSocketID(props.location.state.socketID);
    
    socketRef.current.on("message", (message) => {
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
    socketRef.current.emit("send message", messageObject);
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