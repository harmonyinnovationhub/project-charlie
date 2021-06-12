import React, { useState } from 'react';
import styles from '../scss/signin.module.scss'




function Signin ({updateUserName}) {

  let [username, setUsername] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserName(username);
    setUsername('');

    }
 
  const updateInputValue = (e) => {
    setUsername(username = e.target.value );
   }

  return (  
    <div className={styles.container}>
      <div className="select-username">
        <form onSubmit={handleSubmit}>
          <input name="username" value={username} onChange={updateInputValue}  placeholder="Your username..." />
          <button>Send</button>
        </form>
      </div>
    </div>
  )
} 

export default Signin;
