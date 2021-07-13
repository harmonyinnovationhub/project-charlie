import styles from '../scss/video.module.scss'
import Peer from 'simple-peer';
 import React, { useEffect, useRef, useState, useContext } from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import socket from '../socket';
import { SocketIDContext } from "../context/SocketIDContext";


export default function Video(props) {

 	const [stream, setStream] = useState()
	const [receivingCall, setReceivingCall] = useState(false)
	const [callersocketID, setCallerSocketID] = useState("")
	const [callerName, setCallerName] = useState("")
	const [callerSignal, setCallerSignal] = useState()
	const [callAccepted, setCallAccepted] = useState(false)
	const [callEnded, setCallEnded] = useState(false)
 	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef = useRef()

	const { users, name, userID, socketID, updateUsers, updateName, updateUserID, updateSocketID } = useContext(SocketIDContext);

	useEffect(() => {
		console.log(myVideo);
		
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			myVideo.current.srcObject = stream
		})

		if(props.answered) answerCall();


//////////////Receivers Bagin

		socket.on("callUser", (data) => {
			setReceivingCall(true);
			setCallerSocketID(data.from)
			setCallerName(data.name)
			setCallerSignal(data.signal)
		})
		socket.on("callEnded", (data) => {
			 setCallAccepted(false);
			 console.log(users);
 		})
	}, []) 

	const callUser = (id) => {
		console.log(id);
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			
			
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: socket.id,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})
		connectionRef.current = peer
	}
	//////////// Receiver Ends



	//////////// Callers Begin
	const answerCall = () => {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: callersocketID })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy();
 	}
/////////// Callers End

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<div>
					<h1 className={styles.h1}> Video Chat Application</h1>
				</div>
				<div className={styles.video_container}>
					<div className={styles.video_owner}>
						{stream && <video playsInline muted ref={myVideo} autoPlay />}
					</div>
					<div className={styles.video_caller}>
						{callAccepted && !callEnded ?
							<video playsInline ref={userVideo} autoPlay /> :
							null}
					</div>
				</div>

				<div className={styles.fields}>
					<div className={styles.details}>
						<div className={styles.inputs}>
							<label htmlFor="name">Your Name</label>
							<input type="text" name="name" id="filled-basic" value={name} readOnly></input>
						</div>
						 
						 
					</div>




					<div className={styles.call_button}>
						{callAccepted && !callEnded ? (
							<Button variant="contained" color="secondary" onClick={leaveCall}>
								End Call
							</Button>
						) : (
							!props.answered ? 
							<div>
								<IconButton color="primary" aria-label="call" onClick={() => callUser(props.selectedUser.socketID)}>
									<PhoneIcon fontSize="small" />
								</IconButton>
								{props.selectedUser.socketID}
							</div>
							: null

						)}
					</div>
				</div>

				
			</main>

			<footer className={styles.footer}>
				<p>Copyright @ Team charlie</p>
			</footer>
		</div>
	)
}
