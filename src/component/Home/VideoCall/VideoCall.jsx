import React, { useEffect, useState, useRef } from 'react'
import './VideoCall.css'
/**
 * 
 *  public currentUserId: string;
  public targetUserId: string = null;

  public webrtcPeer: WebRTCPeer;

  public connectionStatus: BehaviorSubject<string> = new BehaviorSubject(
    'not connected'
  );

  public iceConnectionStatus: BehaviorSubject<string> = new BehaviorSubject(
    'not connected'
  );

  public offered = false;
  public answered = false;
  public isInCall = false;

  public isCaller: boolean = false;
  public isCallee: boolean = false;

  public connectedTarget: string = '';
 */

function VideoCall() {
	const [currentUser, setCurrentUser] = useState(null)
	const [targetUser, setTargetUser] = useState(null)

	const [callState, setCallState] = useState({
		isOfered: false,
		isAnswered: false,
		isInCall: false
	})

  const [connStatus, setConnStatus]=  useState({
    connectionStatus: 'not connected',
    iceConnectionStatus: 'not connected'
  })

  const webrtcPeer = useRef()

	useEffect(() => {
		
	}, [])

	return (
		<div className="videoContainer">
			<h1>HELLO NEW CALL HERE</h1>
		</div>

		// <Container>
		//   <Row>
		//     {UserVideo}
		//     {PartnerVideo}
		//   </Row>
		//   <Row>
		//     {Object.keys(users).map((key) => {
		//       if (key === yourID) {
		//         return null;
		//       }
		//       return <button onClick={() => callPeer(key)}>Call {key}</button>;
		//     })}
		//   </Row>
		//   <Row>{incomingCall}</Row>
		// </Container>
	)
}

export default VideoCall
