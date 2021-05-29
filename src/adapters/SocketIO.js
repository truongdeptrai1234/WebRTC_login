
import io from 'socket.io-client';
import { environment } from '../environment'


export class SocketIO {
	static socket;

	static connectSocket() {
		this.socket = io(`${environment.wsUrl}/webrtc`, {
			forceNew: true,
			upgrade: true,
			autoConnect: true,
			secure: true,
			transports: ['websocket'],
		});
		return this.socket;
	}

	static getSocket() {
		return this.socket ?? this.connectSocket();
	}
}
