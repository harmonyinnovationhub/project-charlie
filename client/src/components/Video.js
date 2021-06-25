import styles from '../scss/video.module.scss'
import Peer from 'simple-peer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
	const [caller, setCaller] = useState("")
	const [callerSignal, setCallerSignal] = useState()
	const [callAccepted, setCallAccepted] = useState(false)
	const [idToCall, setIdToCall] = useState("")
	const [callEnded, setCallEnded] = useState(false)
	const [name, setName] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef = useRef()

	const { users,  userID, socketID, updateUsers, updateName, updateUserID, updateSocketID } = useContext(SocketIDContext);


	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			myVideo.current.srcObject = stream
		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
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
				from: socketID,
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

	const answerCall = () => {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}




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
							<label for="name">Your Name</label>
							<input type="text" name="name" id="filled-basic" value={name} onChange={(e) => setName(e.target.value)}></input>
						</div>
						<CopyToClipboard text={socketID}>
							<Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
								Copy ID
							</Button>
						</CopyToClipboard>
						<div className={styles.inputs}>
							<label for="id">ID to Call</label>
							<input type="text" name="id" id="filled-basic" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} ></input>
						</div>
					</div>




					<div className={styles.call_button}>
						{callAccepted && !callEnded ? (
							<Button variant="contained" color="secondary" onClick={leaveCall}>
								End Call
							</Button>
						) : (
							<IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
								<PhoneIcon fontSize="medium" />
							</IconButton>
						)}
						{idToCall}
					</div>
				</div>

				<div className={styles.calls}>
					{receivingCall && !callAccepted ? (
						<div className="caller">
							<h1 >{name} is calling...</h1>
							<Button variant="contained" color="primary" onClick={answerCall}>
								Answer
							</Button>
						</div>
					) : null}
				</div>
			</main>

			<footer className={styles.footer}>
				<p>Copyright @ Team charlie</p>
			</footer>
		</div>
	)
}
