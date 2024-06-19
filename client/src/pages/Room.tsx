import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Peer, { Instance } from 'simple-peer';
import { useParams } from 'react-router-dom';
const SOCKET_SERVER_URL = 'http://localhost:4040'; // 서버 URL

const Video = (props: any) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        props.peer.on('stream', stream => {
            if (ref.current) ref.current.srcObject = stream;
        });
    }, []);

    return <video className="h-[40%] w-[50%]" playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2,
};

const Room = () => {
    const [peers, setPeers] = useState<Instance[]>([]);
    const socketRef = useRef<Socket<any, any>>(io(SOCKET_SERVER_URL, { withCredentials: true }));
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<any[]>([]);
    const params = useParams();
    const roomID = params.roomId;
    console.log(roomID, 'roomID');
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            if (userVideo.current) userVideo.current.srcObject = stream;
            if (socketRef.current) {
                socketRef.current.emit('join room', roomID);
                socketRef.current.on('all users', users => {
                    const _peers: Instance[] = [];
                    users.forEach((userID: string) => {
                        const peer = createPeer(userID, socketRef.current?.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        });
                        _peers.push(peer);
                    });
                    setPeers(_peers);
                });

                socketRef.current.on('user joined', payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    });

                    setPeers(users => [...users, peer]);
                });

                socketRef.current.on('receiving returned signal', payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });
            }
        });
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('sending signal', { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('returning signal', { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }
    console.log('peers', peers);

    return (
        <div className="p-[20px] flex h-screen w-11/12 flex-wrap">
            <video className="h-[40%] w-[50%]" muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return <Video key={index} peer={peer} />;
            })}
        </div>
    );
};

export default Room;
