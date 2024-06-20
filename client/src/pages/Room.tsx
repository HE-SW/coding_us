import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Peer, { Instance } from 'simple-peer';
import { useParams } from 'react-router-dom';
const SOCKET_SERVER_URL = 'http://localhost:4040'; // 서버 URL

const Video = (props: any) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        props.peer.on('stream', (stream: MediaProvider | null) => {
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
    const peersRef = useRef<{ peer: Instance; peerID: string }[]>([]);
    const params = useParams();
    const roomID = params.roomId;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            if (userVideo.current) userVideo.current.srcObject = stream;
            if (socketRef.current) {
                socketRef.current.emit('join room', roomID);
                socketRef.current.on('all users', (users: string[]) => {
                    console.log('all users', users);
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

                socketRef.current.on(
                    'user joined',
                    (payload: { signal: string | Peer.SignalData; callerID: string }) => {
                        const peer = addPeer(payload.signal, payload.callerID, stream);
                        peersRef.current.push({
                            peerID: payload.callerID as string,
                            peer,
                        });
                        setPeers(users => {
                            const filtered = [...users].filter(user => {
                                return user.readable && !user.destroyed;
                            });
                            return [...filtered, peer];
                        });
                    }
                );

                socketRef.current.on(
                    'receiving returned signal',
                    (payload: { id: string; signal: string | Peer.SignalData }) => {
                        const item = peersRef.current.find(p => p.peerID === payload.id);
                        item?.peer.signal(payload.signal);
                    }
                );

                socketRef.current.on('out user', (userId: string) => {
                    const item = peersRef.current.find(p => p.peerID === userId);
                    item?.peer.destroy();
                    setPeers(prev => {
                        const filtered = [...prev].filter(user => {
                            return user.readable && !user.destroyed;
                        });
                        return [...filtered];
                    });
                });
            }
            const muteButton = document.getElementById('mute-button') as HTMLButtonElement;
            muteButton.addEventListener('click', () => {
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    const isMuted = !audioTracks[0].enabled;
                    console.log('Current state before toggle:', audioTracks[0].enabled);
                    audioTracks[0].enabled = isMuted;
                    console.log('New state after toggle:', audioTracks[0].enabled);
                    muteButton.innerText = isMuted ? 'audio Unmute' : 'audio Mute';

                    // 음소거 상태에 따라 비디오 테두리 변경
                    if (userVideo.current) {
                        if (!isMuted) {
                            muteButton.classList.add('bg-blue-200');
                            userVideo.current.classList.add('border-2');
                            userVideo.current.classList.add('border-red-500');
                        } else {
                            muteButton.classList.remove('bg-blue-200');
                            userVideo.current.classList.remove('border-2');
                            userVideo.current.classList.remove('border-red-500');
                        }
                    }
                }
            });

            const muteVideo = document.getElementById('mute-video') as HTMLButtonElement;
            muteVideo.addEventListener('click', () => {
                const videoTracks = stream.getVideoTracks();
                if (videoTracks.length > 0) {
                    const isVideoStopped = !videoTracks[0].enabled;
                    videoTracks[0].enabled = isVideoStopped;
                    muteVideo.innerText = isVideoStopped ? 'video Unmute' : 'video Mute';

                    // 음소거 상태에 따라 비디오 테두리 변경
                    if (userVideo.current) {
                        if (!isVideoStopped) {
                            muteVideo.classList.add('bg-blue-200');
                            userVideo.current.classList.add('border');
                            userVideo.current.classList.add('border-blue-500');
                        } else {
                            muteVideo.classList.remove('bg-blue-200');
                            userVideo.current.classList.remove('border');
                            userVideo.current.classList.remove('border-blue-500');
                        }
                    }
                }
            });
        });
    }, []);

    function createPeer(userToSignal: string, callerID: string | undefined, stream: MediaStream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('sending signal', { userToSignal, callerID, signal });
        });
        // peer.on('error', () => {
        //     setPeers(users => {
        //         const filtered = [...users].filter(user => {
        //             return user.readable && !user.destroyed;
        //         });
        //         return [...filtered];
        //     });
        // });
        return peer;
    }

    function addPeer(incomingSignal: string | Peer.SignalData, callerID: any, stream: MediaStream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('returning signal', { signal, callerID });
        });

        // peer.on('error', () => {
        //     setPeers(users => {
        //         const filtered = [...users].filter(user => {
        //             return user.readable && !user.destroyed;
        //         });
        //         return [...filtered];
        //     });
        // });
        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div className="p-[20px] flex h-screen w-11/12 flex-wrap">
            <div className="flex flex-col">
                <button className="border-2 w-[100px] h-[20px] text-sm border-blue-50" id="mute-video">
                    video Unmute
                </button>
                <button className="border-2 w-[100px] h-[20px] text-sm border-blue-50" id="mute-button">
                    audio Unmute
                </button>
            </div>
            <video id="my-video" className="h-[40%] w-[50%]" muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return <Video key={peer._id} peer={peer} />;
            })}
        </div>
    );
};

export default Room;
