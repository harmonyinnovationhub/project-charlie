
import React, { useState, useEffect } from 'react';
import socket from "../js/socket";
import messageStyles from '../scss/message.module.scss';
import chatStyles from '../scss/chat.module.scss';


function Chat ({users, setUsersFunction, getSelection}) {

  let [selectedUser, setSelectedUser] = useState(null);

  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
    setUsersFunction(users);

  };
  const onSelectUser = (user) => {
    setSelectedUser(user);
    getSelection(user);
    user.hasNewMessages = false;
    setUsersFunction(users);

  }
 

  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });

          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
      setUsersFunction(users);
    });

  })

 

  return (  
    <div className="">
      <div>
        <div>
          {/* {
             (selectedUser) ?
             <Message user={selectedUser} onMessage= {onMessage}/>
           :
             <div></div>
          } */}
        </div>          
      </div>

      <div >
        <div>
          {users.map((user) => <Users user = {user} onSelectUser = {onSelectUser} key={user.userID} selected = { selectedUser === user}/> )}
        </div>
      </div>

    </div>
  )
} 

export default Chat;



function Message ({user, onMessage}) {

  let [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value)
   }

  const displaySender = (message, index) => {
    return (
      index === 0 ||
      user.messages[index - 1].fromSelf !==
      user.messages[index].fromSelf
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessage(input);
    setInput('');

  }

  return (
      <div>
        <div className={messageStyles.header}>
          <div>{ user.connected ? user.username : ""}</div>
        </div>

        <ul className={messageStyles.messages}>

          {
            user.messages.map((message, index) => (
              <li className={messageStyles.messages} key={index}>
  
                { ( displaySender(message, index) ) ? 
                  <div className={messageStyles.sender}>
                    { (message.fromSelf) ? "(yourself)" : user.username }
                  </div>
                  : 
                  <div></div>
                }
                { message.content }

            </li>
            ))
          }

        </ul>

        <form onSubmit={handleSubmit} className={messageStyles.form}>
          <textarea name="message" id="message" value={input} onChange={handleChange} placeholder="Your message..." className={messageStyles.input} />
          <button className={messageStyles.send}> Send </button>
        </form>
      </div>
  )
}



function Users ({user, onSelectUser, selected}) {

  const handleClick = () => {
    onSelectUser(user);
    alert(user.userID);
  }
  return (
    <div className={chatStyles.users} onClick = {handleClick} selected = {selected} className={chatStyles.selected}>
      <div className={chatStyles.description}>
        <div className="name">
          { user.username } { (user.self) ? "(yourself)" : "" }
        </div>
        <div className={chatStyles.status}>

        </div>
      </div>
      {
          (user.hasNewMessages) ?
          <div className={chatStyles.messages}>!</div>
          :
          <div></div>
      }
    </div>
  )
}