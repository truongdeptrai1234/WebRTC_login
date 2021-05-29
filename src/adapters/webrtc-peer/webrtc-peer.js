
export const DEVICE_TYPE = {
  AUDIO_INPUT = 'audioinput',
  VIDEO_INPUT = 'videoinput',
}


export class WebRTCPeer {
  isProduction = false;

  _peerConnection;
  _connectedDevices = [];
  _availableSources = {
    video: true,
    audio: true,
  };

  _localStream = null;

  socket = null;
  _currentUser = null;
  _targetUser = null;
  _currentCameraFacingMode = 'user';

  _socketListeners = {
    offered: [],
    answered: [],
    callhangup: [],
    disconnected: [],
  };

  _receivedOffer = null;
  _receivedAnswer = null;

  _peerConnectionEventListeners = {
    oniceconnectionstatechange: [],
    onconnectionstatechange: [],
    ontrack: [],
  };

  _iceServerList = [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
    'stun:stun2.l.google.com:19302',
    'stun:stun3.l.google.com:19302',
    'stun:stun4.l.google.com:19302',
  ];

  _cachedIceEvents = [];

  constructor(socket, isProduction = false) {
    this.socket = socket;
    this.isProduction = isProduction;
    this.createPeerConnection();
  }

  get peerConnection() {
    return this._peerConnection;
  }

  get currentPeerUser() {
    return this._currentUser;
  }

  get targetPeerUser() {
    return this._targetUser;
  }

  get connectedDevices() {
    return this._connectedDevices;
  }

  get availableMediaSources() {
    return this._availableSources;
  }

  get localStream() {
    return this._localStream;
  }

  get receivedOffer() {
    return this._receivedOffer;
  }
  setReceivedOffer(value) {
    this._receivedOffer = value;
  }

  get receivedAnswer() {
    return this._receivedAnswer;
  }
  setReceivedAnswer(value) {
    this._receivedAnswer = value;
  }

  async getPeerConnection(numberOfIceServers = 1) {
    return (
      this._peerConnection ??
      (await this.createPeerConnection(numberOfIceServers))
    );
  }

  get currentConnectionState() {
    return this._peerConnection.connectionState;
  }

  get currentIceConnectionState() {
    return this._peerConnection.iceConnectionState;
  }

  get isCaller() {
    return !this._receivedOffer && !!this.targetPeerUser;
  }

  get isCallee() {
    return !!this.receivedOffer;
  }

  get isInCall() {
    return (
      (this.isCaller && !!this.receivedAnswer) ||
      (this.isCallee && !!this.targetPeerUser)
    );
  }

  async createPeerConnection(numberOfIceServers = 1) {
    this.logger.log('Creating new peer connection...');
    this._peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: this._iceServerList.slice(
            0,
            numberOfIceServers > 5 ? 5 : numberOfIceServers
          ),
        },
      ],
    });
    await this.enumerateUserDevices(); //

    this._peerConnection.oniceconnectionstatechange =
      this.onIceConnectionStateChange();

    this._peerConnection.onconnectionstatechange =
      this.onConnectionStateChange();

    this._peerConnection.ontrack = this.onTrackEvent();

    this._peerConnection.onicecandidateerror = this.onIceCandidateError();
    this._peerConnection.onicecandidate = this.onIceCandidate();

    this.logger.log(`Created new peer connection`);

    return this._peerConnection;
  }

  onIceConnectionStateChange() {
    return (event) => {
      this.logger.log(
        `Ice connection state change event: ${event?.target['iceConnectionState']}`
      );
      const listeners =
        this._peerConnectionEventListeners['oniceconnectionstatechange'];
      listeners.forEach((listener) => listener(event));
    };
  }
  onConnectionStateChange() {
    return (event) => {
      this.logger.log(
        `Connection state change event: ${event?.target['connectionState']}`
      );
      const listeners =
        this._peerConnectionEventListeners['onconnectionstatechange'];
      listeners.forEach((listener) => listener(event));
    };
  }
  onTrackEvent() {
    return (track) => {
      this.logger.log(
        `Media stream track event: ${track?.target['connectionState']}`
      );
      const listeners = this._peerConnectionEventListeners['ontrack'];
      listeners.forEach((listener) => listener(track));
    };
  }

  onIceCandidateError() {
    return (event) => {
      const { errorCode, errorText, url, type } = event;
      this.logger.error('RTCIceConnection error: ', {
        errorCode,
        errorText,
        url,
        type,
      });
    };
  }

  onIceCandidate() {
    return (event) => {
      if (this.isCallee) {
        console.log(event, `<======= event [webrtc-peer.ts - 202]`);
        this.emitIceEvent(event.candidate);
      }
      if (this.isCaller) {
        this._cachedIceEvents.push(event.candidate);
      }
    };
  }

  registerPeerEventListener(
    type,
    listener
  ) {
    this._peerConnectionEventListeners[type].push(listener);
  }

  removePeerConnectionListeners(type) {
    if (type) {
      return (this._peerConnectionEventListeners[type] = []);
    }
    for (const type in this._peerConnectionEventListeners) {
      this._peerConnectionEventListeners[type] = [];
    }
  }

  setCurrentUser(user) {
    if (!user?.userNanoId) {
      this.logger.error('User Nano Id must be set!');
      return null;
    }

    this._currentUser = user;
    this.logger.log(`New user connected: ${this.currentPeerUser?.userNanoId}`);

    this.socket.emit('online', { userNanoId: user.userNanoId });
    const listenerForUser = this.getListenerForUser(
      this._currentUser.userNanoId
    );
    if (this.socket.hasListeners(listenerForUser.eventName)) {
      this.socket.removeEventListener(listenerForUser.eventName);
    }
    this.socket.on(listenerForUser.eventName, listenerForUser.eventListener);
    this.logger.log(
      `Registered socket listener for user:  ${this.currentPeerUser?.userNanoId}`
    );
    return this._currentUser;
  }

  getListenerForUser(userNanoId) {
    return {
      eventName: `webrtc-${userNanoId}`,
      eventListener: async (data) => {
        const { type } = data;
        switch (type) {
          case 'offered':
            this.setReceivedOffer(data);
            this.emitToListeners('offered', data);
            break;

          case 'answered':
            this.emitToListeners('answered', data);
            await this.onOutGoingCallAnswered(data); // process this directly
            break;

          case 'icecandidate':
            this.addIceCandidateToPC(data);
            break;

          case 'callhangup':
            this.emitToListeners('callhangup', data);
            break;

          case 'disconnected':
            break;

          default:
            break;
        }
      },
    };
  }

  registerSocketListener(
    type,
    listener
  ) {
    if (this._socketListeners[type].length) this._socketListeners[type] = []; // only allow one
    this._socketListeners[type].push(listener);
  }

  removeSocketListeners(type) {
    this._socketListeners[type] = [];
  }

  emitToListeners(type, data = {}) {
    this._socketListeners[type].forEach((listener) => listener(data));
  }

  getLocalStream() {
    return this._localStream ?? this.createLocalStream();
  }

  async enumerateUserDevices() {
    const devices =
      await navigator.mediaDevices.enumerateDevices();
    if (!devices || !devices.length) return null;
    this._connectedDevices = devices;
    this._availableSources = this.getAvailableMediaSources(devices);
    return devices;
  }

  getAvailableMediaSources(devices) {
    const audio =
      !!devices.find((device) => device.kind === DEVICE_TYPE.AUDIO_INPUT) ||
      false;

    const video =
      !!devices.find((device) => device.kind === DEVICE_TYPE.VIDEO_INPUT) ||
      false;

    return { audio, video };
  }

  async getConnectedDevices() {
    return this._connectedDevices ?? (await this.enumerateUserDevices());
  }

  async createLocalStream() {
    const constraints = this.getCurrentUserMedia();
    if (!constraints) {
      this.logger.error('Cannot detect constraints for this device');
      return Promise.resolve(null);
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream, '<======= CREATE LOCAL STREAMMMM');
    this.connectLocalStreamTracks(stream);
    this.logger.log('Local stream connected');
    return stream;
  }

  connectLocalStreamTracks(stream = null) {
    if (!this.localStream && !stream)
      throw new Error('No media stream was found');
    if (stream) {
      this._localStream = stream;
    }
    const tracks = this._localStream.getTracks();
    tracks.forEach((track) =>
      this._peerConnection.addTrack(track, this.localStream)
    );
  }

  getCurrentUserMedia() {
    const { audio, video } = this._availableSources;
    if (!(audio || video)) {
      this.logger.error('No device detected'); // TODO:
      return null;
    }
    const constraints = { audio, video };
    if (audio) {
      constraints.audio = { echoCancellation: true };
    }
    if (video) {
      constraints.video = {
        facingMode: this._currentCameraFacingMode,
        width: {
          min: 640,
          max: 1024,
        },
        height: {
          min: 480,
          max: 768,
        },
      };
    }
    this.logger.log('Get user media constraints successfully');
    return constraints;
  }

  async setCameraFacingMode(mode) {
    this._currentCameraFacingMode = mode;
    this._localStream = await this.getLocalStream();
  }

  async createDescription(type) {
    const options = {
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      voiceActivityDetection: true,
    };
    if (!this._peerConnection) return null;

    // create a description and set it to be the local description
    const description = await (type === 'offer'
      ? this._peerConnection.createOffer(options)
      : this._peerConnection.createAnswer(options));

    if (description) {
      try {
        await this._peerConnection.setLocalDescription(description);
        this.logger.log('Successfully set local dscription');
      } catch (err) {
        this.logger.error('Set local description fail ' + err);
      }
    }
    return description;
  }

  async setRemoteDescription(description) {
    try {
      await this._peerConnection.setRemoteDescription(description);
      this.logger.log(`Successfully set remote description`);
    } catch (err) {
      this.logger.error(`Set remote description failed: `, err);
    }
    return description;
  }

  async createOutgoingCall(toUser) {
    if (!this._currentUser) return this.logger.error('Current user is not set');

    if (!toUser || !toUser.userNanoId)
      return this.logger.error('Target user is not defined');

    this._targetUser = toUser;
    this.logger.log(
      `Making call to target user: ${this.targetPeerUser.userNanoId}`
    );
    const offer = await this.createDescription('offer');
    console.log('LOCAL ICE EVENT');
    this.socket.emit('call-offer', {
      type: 'offered',
      offer,
      fromUserNID: this.currentPeerUser.userNanoId,
      toUserNID: this.targetPeerUser.userNanoId,
    });
  }

  async createPCAnswer(offerData) {
    const { offer } = offerData;
    if (!offer) {
      return this.logger.error(
        `Something went wrong. Received offer is ${offer}`
      );
    }
    await this.setRemoteDescription(offer);
    const callAnswer = await this.createDescription('answer');
    return callAnswer;
  }

  async answerIncomingCall(data = this.receivedOffer) {
    const { fromUserNID, socketId } = data;
    this._targetUser = { userNanoId: fromUserNID };
    console.log(this._targetUser);
    this.logger.log(`Answering call from ${fromUserNID}`);
    const { userNanoId } = this._currentUser;
    const answer = await this.createPCAnswer(data);
    this.socket.emit('call-answer', {
      type: 'answered',
      answer,
      fromUserNID: userNanoId,
      toUserNID: fromUserNID,
      socketId,
    });
    this.logger.log(`Answered call from ${fromUserNID}`);
  }

  async onOutGoingCallAnswered(data) {
    const { answer, fromUserNID } = data;
    this.logger.log(`Received answer from ${fromUserNID}`);
    this.setReceivedAnswer(data);
    const remoteDescription = await this.setRemoteDescription(answer);
    // Send cached resources to peer to establish connection
    this.broadcastCachedIceCandidates();
    return remoteDescription;
  }

  async rejectedCall() {
    const { fromUserNID: fromUserNID } = this.receivedOffer;
    this.setReceivedOffer(null);
    this.socket.emit('call-reject', {
      toUserNID: fromUserNID,
      reason: 'rejected',
    });
  }

  async hangUpCall(
    reason,
    emitToPeer = false
  ) {
    let fromUserNID = null;
    if (this.receivedOffer) fromUserNID = this.receivedOffer.fromUserNID;
    else if (this.receivedAnswer) fromUserNID = this.receivedAnswer.fromUserNID;
    else fromUserNID = this.targetPeerUser?.userNanoId;
    this.logger.log(`Hang up event from ${fromUserNID}`);

    if (fromUserNID && emitToPeer) {
      this.socket.emit('call-hangup', {
        toUserNID: fromUserNID,
        reason,
      });
    }
    return this.cleanUp();
  }

  broadcastCachedIceCandidates() {
    console.log("broadcastCachedIceCandidates", `<======= "broadcastCachedIceCandidates" [webrtc-peer.ts - 511]`);
    if (this._cachedIceEvents.length) {
      for (const event of this._cachedIceEvents) {
        this.emitIceEvent(event);
      }
    }
  }

  emitIceEvent(candidate) {
    console.log(" EMIT ICE EVENT WEBBBBB ")
    this.socket.emit('ice-candidate', {
      type: 'icecandidate',
      iceCandidate: candidate,
      fromUserNID: this.currentPeerUser.userNanoId,
      toUserNID: this.targetPeerUser.userNanoId,
    });
  }

  async addIceCandidateToPC(data) {
    if (!data) return this.logger.error(`Empty data from socket`);
    try {
      return await this._peerConnection.addIceCandidate(data.iceCandidate);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async cleanUp() {
    this.logger.log(`Cleaning up settings...`);
    if (this.isCallee && !this.isInCall) {
      this.logger.log(`Call was not accepted, abort.`);
      return this.setReceivedOffer(null);
    }

    this.removeAllPeerConnListener();
    this.setReceivedAnswer(null);
    this._targetUser = null;

    if (this.peerConnection) {
      this._cachedIceEvents = [];
      this._peerConnection.close();
      // remove old peer and create a new one
      await this.createPeerConnection();
    }

    // re-add tracks to new peer
    this.connectLocalStreamTracks();
    this.logger.log(`Reconnected local stream to new peer connection`);
    this.setCurrentUser(this.currentPeerUser);
  }

  removeAllPeerConnListener() {
    this._peerConnectionEventListeners = {
      ontrack: [],
      onconnectionstatechange: [],
      oniceconnectionstatechange: [],
    };
  }

  get logger() {
    if (this.isProduction) {
      return {
        log: (...content) => { },
        warn: (...content) => { },
        error: (...content) => { },
      };
    }

    return {
      log: (...content) => {
        const { length } = content;
        if (length === 1 && typeof content[0] === 'string') {
          return console.log(`[${WebRTCPeer.name}][INFO] ${content[0]}`);
        }
        return console.log(`[${WebRTCPeer.name}][INFO]:\n`, ...content);
      },
      warn: (...content) => {
        const { length } = content;
        if (length === 1 && typeof content[0] === 'string') {
          return console.log(`[${WebRTCPeer.name}][WARN] ${content[0]}`);
        }
        return console.log(`[${WebRTCPeer.name}][WARN]:\n`, ...content);
      },
      error: (...content) => {
        const { length } = content;
        if (length === 1 && typeof content[0] === 'string') {
          return console.error(`[${WebRTCPeer.name}][ERROR] ${content[0]}`);
        }
        return console.error(`[${WebRTCPeer.name}][ERROR]:\n`, ...content);
      },
    };
  }
}
