import React, { useState, useRef, useMemo } from 'react'

// USE THIS IF RUN USING WEBPACK #FixReact
import { WebRTCPeer } from '@/adapters/webrtc-peer'
import { SocketIO } from '@/adapters/SocketIO'
import { environment } from '@/environment'
import { useStateRef } from '@/hooks/useStateRef'

// TODO: USE THIS IF USE NORMAL REACT #FixReact
// import { WebRTCPeer } from '../../../adapters/webrtc-peer'
// import { SocketIO } from '../../../adapters/SocketIO'
// import { environment } from '../../../environment'
// import { useStateRef } from '../../../hooks/useStateRef'

import './VideoCall.css'
import { ActiveButton } from './Button'

const initialCallState = {
	isOffered: false,
	isAnswered: false,
	isInCall: false,
	isCaller: false,
	isCallee: false
}

function VideoCall() {
	const webrtcPeer = useMemo(() => {
		console.log('Create webrtc peer')
		return new WebRTCPeer(SocketIO.getSocket(), environment.isProduction)
	}, [])
	const [currentUser, setCurrentUser] = useState(null)
	const [userRegistered, setuserRegistered] = useState(false)
	const [targetUser, setTargetUser] = useState('')

	// const [localVideo, setlocalVideo] = useState(null)
	// const [remoteVideo, setremoteVideo] = useState(null)
	const localVideoRef = useRef(null)
	const remoteVideoRef = useRef(null)

	const [callState, setCallState, callStateRef] = useStateRef(initialCallState)

	const [connStatus, setConnStatus] = useState({
		connectionStatus: 'not connected',
		iceConnectionStatus: 'not connected'
	})

	const [localStream, setlocalStream] = useState(null)
	const [remoteStream, setremoteStream] = useState([])

	const registerPeerConnectionListeners = () => {
		webrtcPeer.registerPeerEventListener('onconnectionstatechange', (event) => {
			if (event?.target) {
				if (event?.target['connectionState'] === 'disconnected') {
					hangUpCall()
				}
				setConnStatus({ ...connStatus, connectionStatus: event?.target['connectionState'] })
			}
		})
		webrtcPeer.registerPeerEventListener('oniceconnectionstatechange', (event) => {
			if (event?.target) {
				setConnStatus({ ...connStatus, iceConnectionStatus: event?.target['iceConnectionState'] })
			}
		})
	}

	const showLocalStream = async () => {
		if (localVideoRef.current.srcObject) return
		const localMediaStream = await webrtcPeer.getLocalStream()
		setlocalStream(localMediaStream)
		localVideoRef.current.srcObject = localMediaStream
		console.log('Show local stream')
	}

	const connectRemoteStream = async () => {
		remoteVideoRef.current.srcObject = new MediaStream()
		webrtcPeer.registerPeerEventListener('ontrack', async (event) => {
			remoteVideoRef.current.srcObject.addTrack(event.track)
			setremoteStream([...remoteStream, event.tra])
		})
	}

	const onOffered = (data) => {
		console.log(callStateRef)
		setTargetUser(data?.fromUserNID)
		setCallState({
			...callStateRef.current,
			isOffered: true,
			isCallee: true
		})
	}

	const onAnswered = () => {
		setCallState({
			...callStateRef.current,
			isAnswered: true,
			isInCall: true
		})
		console.log(callState)
		connectRemoteStream()
	}
	const registerSocketListeners = () => {
		webrtcPeer.registerSocketListener('offered', (data) => {
			onOffered.bind(this)(data)
		})
		webrtcPeer.registerSocketListener('answered', (data) => {
			onAnswered()
		})
		webrtcPeer.registerSocketListener('callhangup', () => {
			resetCallStatus()
		})

		webrtcPeer.registerSocketListener('callhangup', async (data) => {
			await webrtcPeer.hangUpCall('hangup')
			resetCallStatus()
			updateConnectionStatus()
		})
	}

	const updateConnectionStatus = () => {
		setConnStatus({
			connectionStatus: webrtcPeer.currentConnectionStatus,
			iceConnectionStatus: webrtcPeer.currentIceConnectionStatus
		})
	}

	const registerCurrentUser = () => {
		setuserRegistered(true)
		webrtcPeer.setCurrentUser({
			userNanoId: currentUser
		})
		registerSocketListeners()
	}

	const acceptCall = async () => {
		setCallState({
			...callState,
			isCallee: true,
			isAnswered: true,
			isInCall: true
		})
		await showLocalStream()

		connectRemoteStream()
		registerPeerConnectionListeners()
		registerSocketListeners()
		await webrtcPeer.answerIncomingCall()
	}

	const createCall = async () => {
		if (!targetUser) {
			console.log('Target user is not set')
			return
		}
		setCallState({
			...callState,
			isCaller: true,
			isOffered: true,
			isAnswered: false
		})

		// init local stream and listener
		await showLocalStream()
		registerPeerConnectionListeners()

		// make the call
		await webrtcPeer.createOutgoingCall({
			userNanoId: targetUser
		})
	}

	const hangUpCall = async () => {
		// if (!callState.isOffered) {
		// 	console.log('Not in call yet, cant hang up')
		// 	return
		// }
		console.log('Manual hang up')
		await webrtcPeer.hangUpCall('hangup', true)
		resetCallStatus()
		updateConnectionStatus()
	}

	const rejectCall = async () => {
		// if (!callState.isOffered) {
		// 	console.log('Not in call yet, cant reject')
		// 	return
		// }
		console.log('Reject call')
		await webrtcPeer.hangUpCall('rejected', true)
		resetCallStatus()
		updateConnectionStatus()
	}

	const resetCallStatus = () => {
		setCallState(initialCallState)
		setTargetUser('')
		setuserRegistered(false)
		remoteVideoRef.current.srcObject = null
	}

	return (
		<div className="video-container">
			<div className="video-sources">
				<div className="video-source local-video">
					<video
						height="240"
						width="320"
						playsInline
						controls={false}
						aria-controls={false}
						autoPlay={true}
						ref={localVideoRef}
					></video>
					{!localStream ? (
						<div className="video-overlay">
							<h1>{currentUser}</h1>
						</div>
					) : null}
					<div className="input-form current-user">
						<input
							disabled={userRegistered}
							type="text"
							name="current-user-inut"
							id="current-user-input"
							onChange={({ target }) => setCurrentUser(target.value)}
						/>
						{!userRegistered ? (
							<ActiveButton
								text={'Set current user'}
								fontSize={15}
								onClick={registerCurrentUser}
							></ActiveButton>
						) : null}
					</div>
				</div>
				<div className="video-source remote-video">
					<video
						height="240"
						width="320"
						playsInline
						controls={false}
						aria-controls={false}
						autoPlay={true}
						ref={remoteVideoRef}
					></video>
					{!remoteStream?.length ? (
						<div className="video-overlay">
							<h1>{targetUser}</h1>
						</div>
					) : null}
					<div className="input-form target-user">
						<input
							disabled={
								(callState?.isCaller && callState?.isOffered) ||
								(callState?.isCallee && callState?.isAnswered)
							}
							value={targetUser}
							type="text"
							name="target-user-input"
							id="target-user-input"
							onChange={({ target }) => setTargetUser(target.value)}
						/>
					</div>
				</div>
			</div>

			<div className="control-buttons">
				{!callState?.isInCall ? (
					<>
						{!callState.isCaller && !callState?.isOffered ? (
							// <button onClick={createCall}>Create call</button>
							<ActiveButton onClick={createCall} text={'Create call'}></ActiveButton>
						) : null}
						{callState?.isCaller && callState.isOffered ? (
							<ActiveButton onClick={hangUpCall} text={'Hang up'}></ActiveButton>
						) : null}
						{callState?.isCallee && callState?.isOffered ? (
							<>
								<ActiveButton onClick={rejectCall} text={'Reject call'}></ActiveButton>
								<ActiveButton onClick={acceptCall} text={'Accept call'}></ActiveButton>
							</>
						) : null}
					</>
				) : (
					<>
						<ActiveButton onClick={hangUpCall} text={'Hangup call'}></ActiveButton>
					</>
				)}
			</div>
		</div>
	)
}

export default VideoCall
